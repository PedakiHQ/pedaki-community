import type { PageType } from '~/app/types.ts';
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

export default function ClassesGeneratePage({ params }: PageType) {
  setStaticParamsLocale(params.locale);

  return (
    <>
      <p>ClassesGeneratePage</p>
    </>
  );
}
