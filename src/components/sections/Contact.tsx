"use client";

import { forwardRef, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/lib/profile";
import { TextReveal } from "@/components/ui/TextReveal";
import { ContactFormModal } from "@/components/ui/ContactFormModal";
import { prefersReducedMotion } from "@/lib/motion-preferences";
import { useTranslations } from "@/components/providers/LocaleProvider";

gsap.registerPlugin(ScrollTrigger);

export const Contact = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<"section"> & { overlay?: boolean }
>(function Contact({ className, overlay = false, ...props }, ref) {
  const t = useTranslations();
  const sectionRef = useRef<HTMLElement>(null);
  const [formOpen, setFormOpen] = useState(false);

  const links = [
    { label: t.contact.email, value: profile.email, href: `mailto:${profile.email}` },
    {
      label: t.contact.phone,
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s/g, "")}`,
    },
    {
      label: t.contact.telegram,
      value: profile.telegram,
      href: "https://t.me/sskkywalker",
      external: true,
    },
  ] as const;

  useGSAP(
    () => {
      if (overlay || prefersReducedMotion()) return;

      gsap.from(".contact-link", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={(node) => {
        sectionRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={`content-panel flex min-h-[70dvh] flex-col justify-center py-16 sm:min-h-[90dvh] sm:py-20${className ? ` ${className}` : ""}`}
      {...props}
    >
      <div className="rounded-2xl border border-border/60 bg-background/85 p-8 backdrop-blur-md sm:p-10">
        <TextReveal
          as="p"
          disabled={overlay}
          className="text-sm uppercase tracking-[0.3em] text-accent"
        >
          {t.contact.eyebrow}
        </TextReveal>
        <TextReveal
          as="h2"
          disabled={overlay}
          className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
          delay={0.1}
        >
          {t.contact.title}
        </TextReveal>
        <TextReveal as="p" disabled={overlay} className="mt-4 text-muted" delay={0.15}>
          {t.contact.subtitle}
        </TextReveal>

        <ul className="mt-10 flex flex-col gap-4">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={"external" in link && link.external ? "_blank" : undefined}
                rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                className="contact-link group flex items-baseline justify-between gap-4 border-b border-border/60 py-3 transition-colors hover:border-accent/40"
              >
                <span className="text-sm uppercase tracking-[0.2em] text-muted">
                  {link.label}
                </span>
                <span className="text-right text-base font-medium transition-colors group-hover:text-accent sm:text-lg">
                  {link.value}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <TextReveal as="div" disabled={overlay} className="mt-8 sm:mt-10" delay={0.2}>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="contact-link inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-medium text-background transition-[opacity,transform] hover:opacity-90 active:scale-[0.98] sm:w-auto"
          >
            {t.contact.sendMessage}
          </button>
        </TextReveal>
      </div>

      <ContactFormModal open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  );
});
