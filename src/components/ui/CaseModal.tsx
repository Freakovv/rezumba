"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "@/components/providers/LocaleProvider";

type CaseModalProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  year: string;
  tags: string[];
  href?: string;
};

type ScrollThumb = {
  height: number;
  top: number;
  visible: boolean;
};

function useVisualViewport() {
  const [viewport, setViewport] = useState<{
    height: number | undefined;
    offsetTop: number;
  }>({ height: undefined, offsetTop: 0 });

  useEffect(() => {
    const update = () => {
      const vv = window.visualViewport;
      setViewport({
        height: vv?.height ?? window.innerHeight,
        offsetTop: vv?.offsetTop ?? 0,
      });
    };

    update();
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return viewport;
}

function CaseModalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<ScrollThumb>({
    height: 0,
    top: 0,
    visible: false,
  });

  const updateThumb = useCallback(() => {
    const element = scrollRef.current;
    const track = trackRef.current;
    if (!element || !track) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const trackHeight = track.clientHeight;

    if (scrollHeight <= clientHeight + 2 || trackHeight <= 0) {
      setThumb({ height: 0, top: 0, visible: false });
      return;
    }

    const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 28);
    const maxTop = Math.max(trackHeight - thumbHeight, 0);
    const scrollRatio = scrollTop / (scrollHeight - clientHeight);

    setThumb({
      height: thumbHeight,
      top: scrollRatio * maxTop,
      visible: true,
    });
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    updateThumb();
    const observer = new ResizeObserver(updateThumb);
    observer.observe(element);
    if (trackRef.current) observer.observe(trackRef.current);

    return () => observer.disconnect();
  }, [updateThumb, children]);

  return (
    <div className="relative min-h-0">
      <div
        ref={scrollRef}
        data-lenis-prevent
        onScroll={updateThumb}
        className="case-prose case-modal-scroll h-full overflow-y-auto overscroll-contain px-5 py-4 pr-7 sm:px-8 sm:py-6 sm:pr-10"
      >
        {children}
      </div>

      <div
        ref={trackRef}
        className={`pointer-events-none absolute top-4 bottom-4 right-2.5 w-1 overflow-hidden rounded-full sm:top-6 sm:bottom-6 sm:right-3${thumb.visible ? " bg-zinc-800/90" : ""}`}
        aria-hidden
      >
        {thumb.visible ? (
          <div
            className="absolute inset-x-0 rounded-full bg-gradient-to-b from-[#5b21b6] to-[#3b0764]"
            style={{ height: thumb.height, transform: `translateY(${thumb.top}px)` }}
          />
        ) : null}
      </div>
    </div>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t.caseModal.closeAria}
      className="inline-flex min-h-9 min-w-9 shrink-0 items-center justify-center rounded-full border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent/40 hover:text-foreground sm:min-h-11 sm:min-w-11 sm:px-3 sm:py-1.5 sm:text-sm"
    >
      {t.caseModal.close}
    </button>
  );
}

export function CaseModal({
  children,
  title,
  subtitle,
  year,
  tags,
  href,
}: CaseModalProps) {
  const t = useTranslations();
  const router = useRouter();
  const lenis = useLenis();
  const { height: viewportHeight, offsetTop: viewportOffsetTop } = useVisualViewport();

  const close = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
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
  }, [close, lenis]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed left-0 right-0 z-50 flex flex-col items-center justify-center p-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:inset-0 sm:p-8"
        style={
          viewportHeight !== undefined
            ? { height: viewportHeight, top: viewportOffsetTop }
            : undefined
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.button
          type="button"
          aria-label={t.caseModal.closeAria}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-modal-title"
          className="relative z-10 grid w-full max-w-2xl min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-2xl shadow-accent/10 sm:max-w-3xl"
          style={
            viewportHeight !== undefined
              ? { maxHeight: Math.max(viewportHeight - 32, 320) }
              : { maxHeight: "min(42rem, calc(100dvh - 2rem))" }
          }
          initial={{ opacity: 0, y: 48, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 48, scale: 0.96 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border bg-surface-elevated px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <div className="min-w-0 pr-2">
              <p className="text-xs text-accent sm:text-sm">{year}</p>
              <h2
                id="case-modal-title"
                className="mt-0.5 text-xl font-semibold tracking-tight sm:mt-1 sm:text-2xl sm:text-3xl"
              >
                {title}
              </h2>
              <p className="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm sm:text-base">{subtitle}</p>
              <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] text-muted sm:px-3 sm:py-1 sm:text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <CloseButton onClick={close} />
          </div>

          <CaseModalScroll>{children}</CaseModalScroll>

          {href ? (
            <div className="shrink-0 border-t border-border bg-surface-elevated px-4 py-3 sm:px-6 sm:py-3.5">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-2 text-sm text-accent transition-opacity hover:opacity-80"
              >
                {t.caseModal.visitLive}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
