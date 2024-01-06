import type { LocaleCode } from '~/locales/server';

export const locales: readonly LocaleCode[] = ['fr', 'en'] as const;
export const fallbackLocale = 'fr' as const;

export const localesLabels: Record<LocaleCode, string> = {
  fr: 'Français',
  en: 'English',
};
