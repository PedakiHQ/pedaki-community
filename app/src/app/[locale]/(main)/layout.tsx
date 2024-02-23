import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AuthProvider from '~/app/[locale]/(main)/AuthProvider.tsx';
import type { LayoutType } from '~/app/types.ts';
import DemoBanner from '~/components/DemoBanner/wrapper';
import I18nProviderClient from '~/components/I18nProviderClient';
import Sidebar from '~/components/layout/Sidebar/Sidebar.tsx';
import dynamic from 'next/dynamic';
import React from 'react';

const TutorialProvider = dynamic(() => import('~/components/tutorial/TutorialProvider.tsx'), {
  ssr: false,
});

export default function MainLayout({ children, params }: LayoutType) {
  return (
    <>
      <DemoBanner locale={params.locale} />
      <ReactQueryDevtools initialIsOpen={false} />

      <div className="relative h-full peer-data-[visible=true]:mt-12">
        <AuthProvider>
          <div className="relative flex min-h-full flex-col sm:flex-row">
            <Sidebar locale={params.locale} />
            <main className="mt-[4rem] min-h-full w-full gap-6 p-2 sm:ml-[17rem] sm:mt-0 sm:pl-0 peer-data-[collapsed=true]:sm:ml-20">
              <div className="h-full rounded-2xl border bg-white p-6 shadow-lg @container">
                <I18nProviderClient locale={params.locale}>{children}</I18nProviderClient>
              </div>
            </main>
          </div>
        </AuthProvider>
        <I18nProviderClient locale={params.locale}>
          <TutorialProvider />
        </I18nProviderClient>
      </div>
    </>
  );
}
