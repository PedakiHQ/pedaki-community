import AuthProvider from '~/app/[locale]/(main)/AuthProvider.tsx';
import type { LayoutType } from '~/app/types.ts';
import Sidebar from '~/components/layout/Sidebar/Sidebar.tsx';
import { I18nProviderClient } from '~/locales/client';
import React from 'react';

export default function MainLayout({ children, params }: LayoutType) {
  return (
    <AuthProvider>
      <div className="flex flex-1 flex-col sm:flex-row">
        <Sidebar locale={params.locale} />
        <main className="mt-[4rem] min-h-screen w-full gap-6 p-2 sm:ml-[17rem] sm:mt-0 sm:pl-0 peer-data-[collapsed=true]:sm:ml-20">
          <div className="grid h-full grid-cols-12 rounded-2xl border bg-white p-8 shadow-lg">
            <I18nProviderClient locale={params.locale} fallback={'locale fallback'}>
              {children}
            </I18nProviderClient>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
