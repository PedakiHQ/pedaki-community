import { IconBookUser } from '@pedaki/design/ui/icons';
import Bidule from '~/app/[locale]/(main)/classes/generate/bidule.tsx';
import type { PageType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import { getI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import React from 'react';

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
      <PageHeader
        title="Générer les classes"
        description="Gérer les paramètres de votre workspace."
        icon={IconBookUser}
      />

      <div className="pt-6" id={MAIN_CONTENT}>
        <Bidule />
      </div>
    </>
  );
}
