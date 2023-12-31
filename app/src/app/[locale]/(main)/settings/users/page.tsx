import Bidule from '~/app/[locale]/(main)/settings/users/bidule.tsx';
import { getScopedI18n, type LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('settings.users');

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
};

export default function UsersSettingsPage() {
  return (
    <>
      <p>UsersSettingsPage</p>
      <Bidule />
    </>
  );
}
