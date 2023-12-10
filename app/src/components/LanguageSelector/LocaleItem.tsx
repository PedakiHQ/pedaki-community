'use client';

import { DropdownMenuItem, DropdownMenuLabel } from '@pedaki/design/ui/dropdown-menu';
import type { IconType } from '@pedaki/design/ui/icons';
import { IconFlagFR, IconFlagGB } from '@pedaki/design/ui/icons';
import { useChangeLocale, useCurrentLocale } from '~/locales/client';
import type { LocaleCode } from '~/locales/server';
import React from 'react';

const LocaleIcon: Record<LocaleCode, IconType> = {
  fr: IconFlagFR,
  en: IconFlagGB,
};

export const LocaleItem = ({ locale }: { locale: LocaleCode }) => {
  const activeLocale = useCurrentLocale();
  const isActive = locale === activeLocale;
  const Icon = LocaleIcon[locale];

  // const languageT = useScopedI18n('components.footer.language');
  const changeLocale = useChangeLocale({ preserveSearchParams: true });

  return (
    <DropdownMenuItem disabled={isActive} key={locale} onClick={() => changeLocale(locale)}>
      <Icon className="h-6 w-6 rounded-lg" />
      {/*<DropdownMenuLabel>{languageT(locale)}</DropdownMenuLabel>*/}
      <DropdownMenuLabel>{locale}</DropdownMenuLabel>
    </DropdownMenuItem>
  );
};
