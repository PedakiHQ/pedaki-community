'use client';

import { I18nProviderClient } from '~/locales/client';
import { TrpcProvider } from '~/server/provider.tsx';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { Toaster } from 'sonner';

interface Props {
  children: (React.ReactElement | React.ReactNode) | (React.ReactElement | React.ReactNode)[];
  locale: string;
}

export const Providers = ({ children, locale }: Props) => {
  return (
    <>
      <Toaster />
      <SessionProvider>
        <TrpcProvider>
          <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
        </TrpcProvider>
      </SessionProvider>
    </>
  );
};
