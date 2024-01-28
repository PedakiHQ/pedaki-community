import { Button } from '@pedaki/design/ui/button';
import { IconDownload, IconPlus, IconUpload, IconUserGroups } from '@pedaki/design/ui/icons';
import type { PageType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import Client from '~/components/students/list/client';
import StudentsListWrapper from '~/components/students/list/wrapper.tsx';
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
        <>
          <Button variant="stroke-primary-main" className="text-sub">
            <IconUpload className="mr-2 h-4 w-4" />
            {t('headerActions.export.label')}
          </Button>
          <Button variant="stroke-primary-main" className="text-sub">
            <IconDownload className="mr-2 h-4 w-4" />
            {t('headerActions.import.label')}
          </Button>
          <Button variant="filled-primary">
            <IconPlus className="mr-2 h-4 w-4" />
            {t('headerActions.create.label')}
          </Button>
        </>
      </PageHeader>

      <div className="h-full pt-6" id={MAIN_CONTENT}>
        <StudentsListWrapper>
          <Client />
        </StudentsListWrapper>
      </div>
    </>
  );
}
