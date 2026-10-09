import { hasLocale } from "next-intl";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
});

export type Locale = (typeof routing.locales)[number];

/**
 * Narrows the raw `params.locale` string that Next hands route handlers into
 * the locale union, falling back to the default for anything unrecognised.
 */
export function resolveLocale(value: string): Locale {
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}
