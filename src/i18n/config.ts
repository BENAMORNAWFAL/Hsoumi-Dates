import en, { type Dictionary } from "./dictionaries/en";
import fr from "./dictionaries/fr";
import ar from "./dictionaries/ar";

export type { Dictionary };

export const LOCALES = ["en", "fr", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Short labels shown in the language switcher. */
export const LOCALE_LABELS: Record<Locale, string> = { en: "EN", fr: "FR", ar: "عربي" };

const DICTIONARIES: Record<Locale, Dictionary> = { en, fr, ar };

export const hasLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

export const getDictionary = (locale: Locale): Dictionary => DICTIONARIES[locale];

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");
