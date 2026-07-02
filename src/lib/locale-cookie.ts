import type { Locale } from "@/i18n/types";

export const LOCALE_COOKIE = "locale";

export function parseLocale(value: string | undefined | null): Locale {
  return value === "ru" ? "ru" : "en";
}

export function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}
