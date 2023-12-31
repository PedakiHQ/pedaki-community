import type { PageType } from '~/app/types.ts';
import { getScopedI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('settings.account');

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
};

export default function AccountSettingsPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  return (
    <>
      <p>AccountSettingsPage</p>
    </>
  );
}
