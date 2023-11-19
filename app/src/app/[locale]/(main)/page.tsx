import type { PageType } from '~/app/types.ts';
import LocaleButton from '~/components/LocaleButton.tsx';
import TestAPI from '~/components/TestAPI.tsx';
import { env } from '~/env.ts';
import { getI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from 'next-international/server';

export default async function Bidule({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getI18n();

  return (
    <main className="yeye flex min-h-screen flex-col items-center justify-between p-24">
      <TestAPI />
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