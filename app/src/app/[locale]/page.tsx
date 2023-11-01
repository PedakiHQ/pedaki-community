'use client';

import { env } from '~/env.ts';
import { useChangeLocale, useCurrentLocale, useI18n } from '~/locales/client';
import type { LocaleCode } from '~/locales/server';
import { api } from '~/server/clients/client';
import { Suspense } from 'react';

function IndexPage() {
  const hello = api.hello.hello.useQuery(
    { text: 'client' },
    {
      refetchInterval: 1000,
    },
  );
  if (!hello.data) {
    return <div>Loadddding...</div>;
  }
  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
}

function LocaleButton({ locale }: { locale: LocaleCode }) {
  const activeLocale = useCurrentLocale();
  const isActive = locale === activeLocale;
  const changeLocale = useChangeLocale({ preserveSearchParams: true });

  return (
    <Suspense>
      <button
        onClick={() => changeLocale(locale)}
        disabled={isActive}
        className="m-3 rounded border-2 border-red-500 p-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {locale}
      </button>
    </Suspense>
  );
}

export default function Bidule() {
  const t = useI18n();

  return (
    <main className="yeye flex min-h-screen flex-col items-center justify-between p-24">
      {/* <IndexPage /> */}
      <p>{env.NEXT_PUBLIC_TESTVALUE}</p>
      <p>bidule</p>
      <p>rebidule</p>
      <div>
        <p>{t('test')}</p>
        <div>
          <LocaleButton locale="en" />
          <LocaleButton locale="fr" />
        </div>
      </div>
    </main>
  );
}
