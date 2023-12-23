import { env } from '~/env.ts';
import dynamic from 'next/dynamic';
import React from 'react';

const DemoBannerComponent = dynamic(() => import('./client'), { ssr: true });

const DemoBanner = () => {
  if (!env.NEXT_PUBLIC_IS_DEMO) {
    return null;
  }

  return <DemoBannerComponent />;
};

export default DemoBanner;
