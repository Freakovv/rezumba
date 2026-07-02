import { cookies } from "next/headers";
import type { Locale } from "@/i18n/types";
import { LOCALE_COOKIE, parseLocale } from "@/lib/locale-cookie";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}
