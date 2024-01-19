import type { LayoutType } from '~/app/types.ts';
import I18nProviderClient from '~/components/I18nProviderClient';
import LanguageSelector from '~/components/LanguageSelector';
import LogoText from '~/components/logo-text.tsx';
import React from 'react';

export default function AuthLayout({ children, params }: LayoutType) {
  return (
    <div className="h-full px-6 py-12 md:px-12">
      <main className="mx-auto grid h-full max-w-screen-2xl grid-cols-1 gap-12">
        <div className="flex h-full flex-col">
          <LogoText height={54} width={156} />

          <I18nProviderClient locale={params.locale}>
            <div className="h-full">{children}</div>

            <div className="flex justify-end">
              <LanguageSelector />
            </div>
          </I18nProviderClient>
        </div>
      </main>
    </div>
  );
}
