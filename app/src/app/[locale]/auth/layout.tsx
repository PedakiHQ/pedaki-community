import LanguageSelector from '~/components/LanguageSelector';
import Logo from '~/components/logo.tsx';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full px-6 py-12 md:px-12">
      <main className="mx-auto grid h-full max-w-screen-2xl grid-cols-1 gap-12">
        <div className="flex h-full flex-col">
          <Logo height={54} width={156} />

          <div className="h-full">{children}</div>

          <div className="flex justify-end">
            <LanguageSelector />
          </div>
        </div>
      </main>
    </div>
  );
}
