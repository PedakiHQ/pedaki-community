import { IconUserGroups } from '@pedaki/design/ui/icons';
import ClassesListPageClient from '~/app/[locale]/(main)/classes/(list)/classes-list-page-client';
import type { PageType } from '~/app/types.ts';
import ClassesListWrapper from '~/components/classes/list/wrapper';
import PageHeader from '~/components/PageHeader.tsx';
import type { LocaleCode } from '~/locales/server.ts';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('classes.list');

  return {
    title: t('metadata.title'),
  };
};

export default async function ClassesListPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('classes.list');

  return (
    <>
      <PageHeader
        title={t('header.title')}
        description={t('header.description')}
        icon={IconUserGroups}
      ></PageHeader>

      <div className="h-full @4xl:pt-6" id={MAIN_CONTENT}>
        <ClassesListWrapper>
          <ClassesListPageClient />
        </ClassesListWrapper>
      </div>
    </>
  );
}
