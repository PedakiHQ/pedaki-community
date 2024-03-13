import { IconUserPlus } from '@pedaki/design/ui/icons';
import type { PageType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import EditStudentForm from '~/components/students/one/edit-student-form';
import type { LocaleCode } from '~/locales/server.ts';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { api } from '~/server/clients/internal.ts';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('students.create');

  return {
    title: t('metadata.title'),
  };
};

export default async function StudentsCreatePage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('students.create');

  const properties = await api.students.properties.getMany.query(undefined);

  return (
    <>
      <PageHeader
        title={t('header.title')}
        description={t('header.description')}
        icon={IconUserPlus}
      />
      <div className="flex h-full flex-col gap-6 @4xl:pt-6">
        <EditStudentForm properties={properties} />
      </div>
    </>
  );
}
