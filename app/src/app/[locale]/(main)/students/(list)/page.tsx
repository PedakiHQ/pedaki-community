import { Button } from '@pedaki/design/ui/button';
import { IconDownload, IconPlus, IconUserGroups } from '@pedaki/design/ui/icons';
import Client from '~/app/[locale]/(main)/students/(list)/client.tsx';
import type { PageType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import type { LocaleCode } from '~/locales/server.ts';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { api } from '~/server/clients/server.ts';
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

  const [propertiesMapping, classesMapping, teachersMapping] = await Promise.all([
    api.students.properties.getMany.query(),
    api.classes.getMany.query(),
    api.teachers.getMany.query(),
  ]);

  return (
    <>
      <PageHeader
        title={t('header.title')}
        description={t('header.description')}
        icon={IconUserGroups}
      >
        <>
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

      <div className="pt-6" id={MAIN_CONTENT}>
        <Client
          propertiesMapping={propertiesMapping}
          classesMapping={classesMapping}
          teachersMapping={teachersMapping}
        />
      </div>
    </>
  );
}
