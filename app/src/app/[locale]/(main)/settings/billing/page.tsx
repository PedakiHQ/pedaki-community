import type { PageType } from '~/app/types.ts';
import { getScopedI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('settings.billing');

  return {
    title: t('metadata.title'),
  };
};

export default function BillingSettingsPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  // TODO: move to premium
  return (
    <>
      <p>BillingSettingsPage</p>
    </>
  );
}
