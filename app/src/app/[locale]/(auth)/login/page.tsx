import type { PageType } from '~/app/types.ts';
import { setStaticParamsLocale } from 'next-international/server';

export default async function AuthLogin({ params }: PageType) {
  setStaticParamsLocale(params.locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>login here</p>
    </main>
  );
}
