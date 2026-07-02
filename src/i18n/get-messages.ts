import { en } from "./en";
import { ru } from "./ru";
import type { Locale, Messages } from "./types";

const messages: Record<Locale, Messages> = { en, ru };

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
