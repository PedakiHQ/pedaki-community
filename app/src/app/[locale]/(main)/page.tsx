import TestAuthComponent from '~/app/[locale]/(main)/TestAuthComponent.tsx';
import type { PageType } from '~/app/types.ts';
import LocaleButton from '~/components/LocaleButton.tsx';
import TestAPI from '~/components/TestAPI.tsx';
import { env } from '~/env.ts';
import { getI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getI18n();

  return {
    title: t('metadata.title'),
  };
};

export default async function Bidule({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getI18n();

  return (
    <>
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
      <TestAuthComponent />
    </>
  );
}
