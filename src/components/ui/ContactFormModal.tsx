"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { profile } from "@/lib/profile";
import { prefersReducedMotion } from "@/lib/motion-preferences";
import {
  buildTelegramContactUrl,
  validateContactForm,
  type ContactFormValues,
} from "@/lib/telegram-deeplink";
import { useLocale, useTranslations } from "@/components/providers/LocaleProvider";

type ContactFormModalProps = {
  open: boolean;
  onClose: () => void;
};

const initialValues: ContactFormValues = {
  name: "",
  message: "",
};

const subscribeNoop = () => () => {};

export function ContactFormModal({ open, onClose }: ContactFormModalProps) {
  const { locale } = useLocale();
  const t = useTranslations();
  const lenis = useLenis();
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Once opened, the modal stays mounted so GSAP can play the exit
  // animation; visibility is fully driven by autoAlpha.
  const [hasOpened, setHasOpened] = useState(false);
  if (open && !hasOpened) setHasOpened(true);
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setCompany("");
    setStatus("idle");
    setError("");
  }, []);

  const close = useCallback(() => {
    onClose();
    window.setTimeout(resetForm, 220);
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!open) return;

    lenis?.stop();

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      window.removeEventListener("keydown", onKeyDown);
      lenis?.start();
    };
  }, [close, lenis, open]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const dialog = dialogRef.current;
      if (!hasOpened || !root || !dialog) return;

      const reduced = prefersReducedMotion();

      if (open) {
        if (reduced) {
          gsap.set(root, { autoAlpha: 1 });
          gsap.set(dialog, { autoAlpha: 1, y: 0, scale: 1 });
          return;
        }
        gsap.fromTo(
          root,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.25, ease: "power1.out", overwrite: "auto" },
        );
        gsap.fromTo(
          dialog,
          { autoAlpha: 0, y: 32, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "expo.out", overwrite: "auto" },
        );
        return;
      }

      if (reduced) {
        gsap.set(root, { autoAlpha: 0 });
        return;
      }
      gsap.to(dialog, {
        autoAlpha: 0,
        y: 24,
        scale: 0.98,
        duration: 0.22,
        ease: "power2.in",
        overwrite: "auto",
      });
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.22,
        ease: "power2.in",
        overwrite: "auto",
      });
    },
    { dependencies: [open, hasOpened] },
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (company.trim()) return;

    const validationError = validateContactForm(values, locale);
    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    const url = buildTelegramContactUrl(profile.telegram, values, locale);
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus("success");
    setError("");
  };

  if (!mounted || !hasOpened) return null;

  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
    >
          <button
            type="button"
            aria-label={t.contact.form.closeAria}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={close}
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-form-title"
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-2xl shadow-accent/10"
            onClick={(event) => event.stopPropagation()}
            data-lenis-prevent
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-accent">
                  {t.contact.form.eyebrow}
                </p>
                <h2
                  id="contact-form-title"
                  className="mt-1 text-2xl font-semibold tracking-tight"
                >
                  {t.contact.form.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border border-border px-2.5 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground"
              >
                {t.contact.form.close}
              </button>
            </div>

            {status === "success" ? (
              <div className="px-5 py-8 sm:px-6">
                <p className="text-lg font-medium">{t.contact.form.successTitle}</p>
                <p className="mt-2 text-sm text-muted">
                  {locale === "en" ? (
                    <>
                      Tap <span className="text-foreground">Send</span> in Telegram to deliver your
                      message.
                    </>
                  ) : (
                    t.contact.form.successBody
                  )}
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {t.contact.form.close}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                  <label htmlFor="contact-company">Company</label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="contact-name" className="text-sm text-muted">
                    {t.contact.form.name}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, name: event.target.value }))
                    }
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent/50"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-sm text-muted">
                    {t.contact.form.message}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={values.message}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, message: event.target.value }))
                    }
                    className="mt-1.5 w-full resize-none rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent/50"
                  />
                </div>

                {status === "error" ? (
                  <p className="text-sm text-red-400">{error}</p>
                ) : null}

                <button
                  type="submit"
                  className="w-full rounded-full bg-accent px-4 py-3 text-sm font-medium text-background transition-[opacity,transform] hover:opacity-90 active:scale-[0.98]"
                >
                  {t.contact.form.submit}
                </button>
              </form>
            )}
          </div>
    </div>,
    document.body,
  );
}
