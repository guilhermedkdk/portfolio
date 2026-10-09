import type { routing } from "@/i18n/routing";

// Teaches next-intl this app's locale union, so useLocale()/getLocale() return
// "pt" | "en" instead of a loose string.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
  }
}
