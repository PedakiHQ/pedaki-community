import type { PageType } from '~/app/types.ts';
import { getI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getI18n();

  return {
    title: t('metadata.title'),
  };
};

export default function UsersSettingsPage({ params }: PageType) {
  return (
    <>
      <p>UsersSettingsPage</p>
    </>
  );
}
