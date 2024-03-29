'use client';

import { DropdownMenuItem } from '@pedaki/design/ui/dropdown-menu';
import { LocaleIcon } from '~/components/LanguageSelector/LocaleIcon.tsx';
import { useChangeLocale, useCurrentLocale } from '~/locales/client';
import type { LocaleCode } from '~/locales/server';
import { localesLabels } from '~/locales/shared';
import React from 'react';

export const LocaleItem = ({ locale }: { locale: LocaleCode }) => {
  const activeLocale = useCurrentLocale();
  const isActive = locale === activeLocale;
  const Icon = LocaleIcon[locale];

  const changeLocale = useChangeLocale({ preserveSearchParams: true });

  return (
    <DropdownMenuItem disabled={isActive} key={locale} onClick={() => changeLocale(locale)}>
      <Icon className="h-4 w-5 rounded-sm" />
      <span>{localesLabels[locale]}</span>
    </DropdownMenuItem>
  );
};
