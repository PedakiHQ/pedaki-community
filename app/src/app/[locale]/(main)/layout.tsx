import AuthProvider from '~/app/[locale]/(main)/AuthProvider.tsx';
import type { LayoutType } from '~/app/types.ts';
import Sidebar from '~/components/layout/Sidebar/Sidebar.tsx';
import { I18nProviderClient } from '~/locales/client';
import React from 'react';

export default function MainLayout({ children, params }: LayoutType) {
  return (
    <AuthProvider>
      <div className="flex flex-1">
        <Sidebar locale={params.locale} />
        <main className="ml-[17rem] min-h-screen w-full gap-6 p-2 pl-0 peer-data-[collapsed=true]:ml-20">
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
