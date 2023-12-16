import type { LocaleCode } from '~/locales/server';
import { fallbackLocale, locales } from '~/locales/shared';
import { setStaticParamsLocale as originalSetStaticParamsLocale } from 'next-international/server';

export const fixLocale = (locale: string): LocaleCode =>
  locales.includes(locale as LocaleCode) ? (locale as LocaleCode) : fallbackLocale;

export const setStaticParamsLocale = (locale: string) =>
  originalSetStaticParamsLocale(fixLocale(locale));
