import { IconUserGroups } from '@pedaki/design/ui/icons';
import HeaderActions from '~/app/[locale]/(main)/students/(list)/header-actions.tsx';
import StudentsListPageClient from '~/app/[locale]/(main)/students/(list)/students-list-page-client';
import type { PageType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import StudentsListWrapper from '~/components/students/list/wrapper';
import type { LocaleCode } from '~/locales/server.ts';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('students.list');

  return {
    title: t('metadata.title'),
  };
};

export default async function StudentsListPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('students.list');

  return (
    <>
      <PageHeader
        title={t('header.title')}
        description={t('header.description')}
        icon={IconUserGroups}
      >
        <HeaderActions />
      </PageHeader>

      <div className="h-full pt-6" id={MAIN_CONTENT}>
        <StudentsListWrapper>
          <StudentsListPageClient />
        </StudentsListWrapper>
      </div>
    </>
  );
}
