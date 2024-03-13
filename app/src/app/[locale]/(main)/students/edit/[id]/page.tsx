import { IconUser } from '@pedaki/design/ui/icons';
import type { PageType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader';
import EditStudentForm from '~/components/students/one/edit-student-form';
import { getScopedI18n } from '~/locales/server';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { api } from '~/server/clients/internal';
import React from 'react';

export const generateMetadata = async ({ params }: PageType) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('students.edit');

  return {
    title: t('metadata.title'),
  };
};

export default async function StudentsEditPage({ params }: PageType<{ id: string }>) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('students.edit');

  const student = await api.students.getOne.query({ id: Number(params.id) });
  const properties = await api.students.properties.getMany.query(undefined);

  return (
    <>
      <PageHeader
        title={t('header.title', { firstName: student.firstName, lastName: student.lastName })}
        description={t('header.description')}
        icon={IconUser}
      ></PageHeader>
      <div className="flex h-full flex-col gap-6 @4xl:pt-6">
        <EditStudentForm student={student} properties={properties} />
      </div>
    </>
  );
}
