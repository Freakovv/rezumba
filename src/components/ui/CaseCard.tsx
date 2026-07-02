"use client";

import Link from "next/link";
import type { CaseMeta } from "@/lib/cases";
import { useLocale, useTranslations } from "@/components/providers/LocaleProvider";

type CaseCardProps = {
  caseItem: CaseMeta;
};

export function CaseCard({ caseItem }: CaseCardProps) {
  const { locale } = useLocale();
  const t = useTranslations();
  const isRu = locale === "ru";

  return (
    <Link
      href={`/cases/${caseItem.slug}`}
      scroll={false}
      className="group relative block overflow-hidden rounded-xl border border-border bg-surface/40 p-4 transition-all duration-500 hover:border-accent/30 hover:bg-surface/70 hover:shadow-[0_0_32px_-18px_rgba(167,139,250,0.2)] sm:p-5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <p
            className={`text-accent ${isRu ? "text-[11px] leading-snug sm:text-xs" : "text-xs sm:text-sm"}`}
          >
            {caseItem.year}
          </p>
          <span
            className={`shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground ${
              isRu ? "text-[11px] leading-snug sm:text-xs" : "text-xs sm:text-sm"
            }`}
          >
            {t.cases.viewCase}
          </span>
        </div>

        <h3
          className={`mt-2 font-semibold sm:mt-2.5 ${
            isRu
              ? "text-lg leading-snug sm:text-xl"
              : "text-xl tracking-tight sm:text-2xl"
          }`}
        >
          {caseItem.title}
        </h3>
        <p
          className={`mt-1.5 text-muted ${
            isRu
              ? "text-[13px] leading-relaxed text-foreground/65 sm:text-sm"
              : "text-sm sm:text-base"
          }`}
        >
          {caseItem.subtitle}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
          {caseItem.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-[11px] text-muted sm:px-3 sm:py-1 sm:text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
