import type { Locale } from "@/i18n/types";
import { getMessages } from "@/i18n/get-messages";

export type ContactFormValues = {
  name: string;
  message: string;
};

export function validateContactForm(
  values: ContactFormValues,
  locale: Locale = "en",
): string | null {
  const { contact } = getMessages(locale);
  const name = values.name.trim();
  const message = values.message.trim();

  if (name.length < 2 || name.length > 80) {
    return contact.form.validation.name;
  }

  if (!message) {
    return contact.form.validation.message;
  }

  return null;
}

export function buildTelegramContactUrl(
  telegramHandle: string,
  values: ContactFormValues,
  locale: Locale = "en",
) {
  const { contact } = getMessages(locale);
  const username = telegramHandle.replace(/^@/, "");
  const greeting = contact.form.telegramGreeting.replace("{name}", values.name.trim());
  const text = [greeting, "", values.message.trim()].join("\n");

  return `https://t.me/${username}?text=${encodeURIComponent(text)}`;
}
