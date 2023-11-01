import { createI18nServer } from 'next-international/server';
import fr from './fr';

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } = createI18nServer(
  {
    fr: () => import('./fr'),
    en: () => import('./en'),
  },
  {
    fallbackLocale: fr,
  },
);

export type LocaleCode = ReturnType<typeof getCurrentLocale>;
