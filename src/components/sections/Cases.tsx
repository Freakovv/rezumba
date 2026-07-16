"use client";

import { forwardRef, useRef, type ComponentPropsWithoutRef } from "react";
import type { CaseMeta } from "@/lib/cases";
import { CaseCard } from "@/components/ui/CaseCard";
import { TextReveal } from "@/components/ui/TextReveal";
import { useTranslations } from "@/components/providers/LocaleProvider";

type CasesProps = ComponentPropsWithoutRef<"section"> & {
  cases: CaseMeta[];
  overlay?: boolean;
};

export const Cases = forwardRef<HTMLElement, CasesProps>(function Cases(
  { cases, className, overlay = false, ...props },
  ref,
) {
  const t = useTranslations();
  const sectionRef = useRef<HTMLElement>(null);

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
      <div
        className={`w-full rounded-2xl border border-border/60 bg-background/85 backdrop-blur-md ${
          overlay ? "p-6 sm:p-8" : "p-8 sm:p-10"
        }`}
      >
        <TextReveal
          as="p"
          disabled={overlay}
          className="text-xs uppercase tracking-[0.28em] text-accent sm:text-sm sm:tracking-[0.3em]"
        >
          {t.cases.eyebrow}
        </TextReveal>
        <TextReveal
          as="h2"
          disabled={overlay}
          className="mt-3 text-2xl font-semibold tracking-tight sm:mt-4 sm:text-3xl sm:text-4xl"
          delay={0.1}
        >
          {t.cases.title}
        </TextReveal>
        <div className="mt-6 grid gap-3 sm:mt-8">
          {cases.map((caseItem) => (
            <CaseCard key={caseItem.slug} caseItem={caseItem} />
          ))}
        </div>
      </div>
    </section>
  );
});
