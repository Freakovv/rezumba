"use client";

import { forwardRef, useMemo, useRef, type ComponentPropsWithoutRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stack } from "@/lib/profile";
import { useTranslations } from "@/components/providers/LocaleProvider";
import { TextReveal } from "@/components/ui/TextReveal";
import { prefersReducedMotion } from "@/lib/motion-preferences";

gsap.registerPlugin(ScrollTrigger);

export const Stack = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<"section"> & { overlay?: boolean }
>(function Stack({ className, overlay = false, ...props }, ref) {
  const t = useTranslations();
  const sectionRef = useRef<HTMLElement>(null);

  const stackGroups = useMemo(
    () => [
      { label: t.stack.groups.languages, items: stack.languages },
      { label: t.stack.groups.database, items: stack.database },
      { label: t.stack.groups.infrastructure, items: stack.infrastructure },
      {
        label: t.stack.groups.other,
        items: [
          t.stack.otherItems.englishB1,
          t.stack.otherItems.crossPlatform,
          t.stack.otherItems.qa,
          t.stack.otherItems.devops,
          t.stack.otherItems.restApis,
        ],
      },
    ],
    [t],
  );

  useGSAP(
    () => {
      if (overlay || prefersReducedMotion()) return;

      gsap.from(".stack-tag", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    },
    { scope: sectionRef },
  );

  const sectionClassName = [
    "content-panel flex flex-col",
    overlay
      ? "min-h-0 max-h-full justify-center overflow-hidden py-0 sm:py-8"
      : "min-h-[90dvh] justify-center py-16 sm:py-20",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={(node) => {
        sectionRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={sectionClassName}
      {...props}
    >
      <div className="w-full rounded-2xl border border-border/60 bg-background/85 p-6 backdrop-blur-md sm:p-8 sm:p-10">
        <TextReveal
          as="p"
          disabled={overlay}
          className="text-xs uppercase tracking-[0.28em] text-accent sm:text-sm sm:tracking-[0.3em]"
        >
          {t.stack.eyebrow}
        </TextReveal>
        <TextReveal
          as="h2"
          disabled={overlay}
          className="mt-3 text-2xl font-semibold tracking-tight sm:mt-4 sm:text-3xl sm:text-4xl"
          delay={0.1}
        >
          {t.stack.title}
        </TextReveal>
        <TextReveal
          as="p"
          disabled={overlay}
          className={`mt-3 text-sm text-muted sm:mt-4${overlay ? " max-sm:hidden" : ""}`}
          delay={0.15}
        >
          {t.stack.subtitle}
        </TextReveal>

        <div
          className={`mt-6 grid gap-5 sm:mt-10 sm:gap-8 sm:gap-10${
            overlay ? " max-sm:grid-cols-2" : ""
          }`}
        >
          {stackGroups.map((group) => (
            <div key={group.label}>
              <h3 className="mb-2 text-xs uppercase tracking-[0.18em] text-muted sm:mb-3 sm:text-sm sm:tracking-[0.2em]">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="stack-tag rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-foreground/90 transition-colors hover:border-accent/40 hover:text-accent sm:px-3.5 sm:py-1.5 sm:text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
