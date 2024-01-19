'use client';

import { createI18nClient } from 'next-international/client';
import fr from './fr';

export const { useI18n, useScopedI18n, I18nProviderClient, useCurrentLocale, useChangeLocale } =
  createI18nClient(
    {
      fr: () => import('./fr'),
      en: () => import('./en'),
    },
    {
      fallbackLocale: fr,
    },
  );

export type UseI18nType = ReturnType<typeof useI18n>;
export type UseScopedI18nType<T extends Parameters<typeof useScopedI18n>[0]> = ReturnType<
  typeof useScopedI18n<T>
>;
