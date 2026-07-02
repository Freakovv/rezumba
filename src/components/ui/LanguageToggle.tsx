"use client";

import { useLocale, useTranslations } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/i18n/types";

const linkClassName =
  "inline-block transition duration-300 hover:scale-105 hover:text-white active:scale-105";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const t = useTranslations();
  const nextLocale: Locale = locale === "en" ? "ru" : "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      aria-label={t.languageToggle.ariaLabel}
      className={`${linkClassName} text-[9px] uppercase tracking-[0.16em] text-zinc-300 sm:text-[13px] sm:tracking-[0.26em]`}
    >
      {locale.toUpperCase()}
    </button>
  );
}
