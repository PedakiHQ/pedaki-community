import Header from '~/app/[locale]/(main)/(index)/header.tsx';
import type { PageType } from '~/app/types.ts';
import dayjs from '~/locales/dayjs.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { getI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getI18n();

  return {
    title: t('metadata.title'),
  };
};

export default function IndexPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);

  return (
    <>
      <Header description={dayjs().format('LL')} />
    </>
  );
}
