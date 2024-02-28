import { IconBookUser } from '@pedaki/design/ui/icons';
import ConfigurationCard from '~/app/[locale]/(main)/classes/generate/configuration-card.tsx';
import RulesCard from '~/app/[locale]/(main)/classes/generate/rules-card.tsx';
import type { PageType } from '~/app/types.ts';
import ImportStudents from '~/components/classes/generate/ImportStudents.tsx';
import { GenerateClassesRulesWrapper } from '~/components/classes/generate/Wrapper.tsx';
import PageHeader from '~/components/PageHeader.tsx';
import StudentsListWrapper from '~/components/students/list/wrapper';
import type { LocaleCode } from '~/locales/server.ts';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import StoreProvider from '~/store/classes/generate/StoreProvider.tsx';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import React from 'react';
import { RulesInput } from './RulesInput';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('classes.generate');

  return {
    title: t('metadata.title'),
  };
};

export default async function ClassesGeneratePage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('classes.generate');

  return (
    <>
      <PageHeader
        title={t('header.title')}
        description={t('header.description')}
        icon={IconBookUser}
      />

      <StoreProvider>
        <StudentsListWrapper>
          <div
            className="flex h-full flex-col-reverse gap-6 @4xl:flex-row @4xl:pt-6"
            id={MAIN_CONTENT}
          >
            <div className="relative flex min-w-[400px] flex-col gap-4">
              <ConfigurationCard />
              <RulesCard />
            </div>
            <div className="flex-1 bg-green-dark"></div>
          </div>
        </StudentsListWrapper>
      </StoreProvider>
    </>
  );
}
