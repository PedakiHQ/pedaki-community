import type { LocaleCode } from '~/locales/server';

export const locales: readonly LocaleCode[] = ['fr', 'en'] as const;
export const fallbackLocale: LocaleCode = 'fr' as const;
