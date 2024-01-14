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

// Typescript helper Awaited is recursive and we only need to await the first level
type FirstLevelAwaited<T> = T extends Promise<infer U> ? U : T;

export type GetI18nType = FirstLevelAwaited<ReturnType<typeof getI18n>>;
export type GetScopedI18nType<T extends Parameters<typeof getScopedI18n>[0]> = FirstLevelAwaited<
  ReturnType<typeof getScopedI18n<T>>
>;
