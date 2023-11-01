'use client';

import { I18nProviderClient } from '~/locales/client';
import { TrpcProvider } from '~/server/provider.tsx';
import React from 'react';

interface Props {
  children: (React.ReactElement | React.ReactNode) | (React.ReactElement | React.ReactNode)[];
  locale: string;
}

export const Providers = ({ children, locale }: Props) => {
  console.log('provider locale', locale);

  return (
    <>
      <TrpcProvider>
        <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
      </TrpcProvider>
    </>
  );
};
