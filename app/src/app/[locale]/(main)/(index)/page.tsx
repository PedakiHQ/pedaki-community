import Header from '~/app/[locale]/(main)/(index)/header.tsx';
import type { PageType } from '~/app/types.ts';
import TutorialStatusCard from '~/components/tutorial/TutorialStatusCard';
import dayjs from '~/locales/dayjs.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('main');

  return {
    title: t('metadata.title'),
  };
};

export default function IndexPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);

  return (
    <>
      <Header description={dayjs().format('LL')} />

      <div className="grid grid-cols-12 gap-6 pt-6" id={MAIN_CONTENT}>
        <div className="col-span-12 @4xl/main:col-span-6">
          <TutorialStatusCard />
        </div>
      </div>
    </>
  );
}
