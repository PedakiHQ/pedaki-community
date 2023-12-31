import { env } from '~/env.ts';
import { I18nProviderClient } from '~/locales/client';
import dynamic from 'next/dynamic';
import React from 'react';

const DemoBannerComponent = dynamic(() => import('./client'), { ssr: true });

interface DemoBannerProps {
  locale: string;
}

const DemoBanner = ({ locale }: DemoBannerProps) => {
  if (!env.NEXT_PUBLIC_IS_DEMO) {
    return null;
  }

  return (
    <I18nProviderClient locale={locale}>
      <DemoBannerComponent />
    </I18nProviderClient>
  );
};

export default DemoBanner;
