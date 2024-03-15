import { IconUserGroups } from '@pedaki/design/ui/icons';
import type { PageType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import EditStudentForm from '~/components/students/one/edit-student-form';
import TutorialTrigger from '~/components/tutorial-trigger.tsx';
import type { LocaleCode } from '~/locales/server.ts';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import { api } from '~/server/clients/internal.ts';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import { TUTORIAL_ID } from '~/store/tutorial/data/schema-student/constants';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('students.schema');

  return {
    title: t('metadata.title'),
  };
};

export default async function StudentSchemaPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('students.schema');

  const initialProperties = await api.students.properties.getMany.query(undefined);

  return (
    <>
      <PageHeader
        title={t('header.title')}
        description={t('header.description')}
        icon={IconUserGroups}
      />
      <TutorialTrigger id={TUTORIAL_ID} step={1} />
      <div className="flex h-full flex-col gap-6 @4xl:pt-6" id={MAIN_CONTENT}>
        <EditStudentForm properties={initialProperties} editSchema />
      </div>
    </>
  );
}
