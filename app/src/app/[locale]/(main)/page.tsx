import TestAuthComponent from '~/app/[locale]/(main)/TestAuthComponent.tsx';
import { TestSettingComponent } from '~/app/[locale]/(main)/TestSettingComponent.tsx';
import type { PageType } from '~/app/types.ts';
import LocaleButton from '~/components/LocaleButton.tsx';
import TestAPI from '~/components/TestAPI.tsx';
import { env } from '~/env.ts';
import { getI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import { getWorkspaceSettings } from '~/settings';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getI18n();

  return {
    title: { absolute: t('metadata.title') }
  };
};

export default async function Bidule({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getI18n();

  const nameSetting = (await getWorkspaceSettings()).NAME;

  return (
    <>
      <TestAPI />
      <p>{env.NEXT_PUBLIC_TESTVALUE}</p>
      <p>bidule</p>
      <p>rebidule</p>
      <p>{nameSetting}</p>
      <div>
        <p>{t('test')}</p>
        <div>
          <LocaleButton locale="en" />
          <LocaleButton locale="fr" />
        </div>
      </div>
      <TestAuthComponent />
      <TestSettingComponent />
    </>
  );
}
