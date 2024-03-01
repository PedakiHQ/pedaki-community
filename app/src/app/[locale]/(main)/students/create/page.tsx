import { IconUserPlus } from '@pedaki/design/ui/icons';
import { Separator } from '@pedaki/design/ui/separator';
import type { PageType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import EditStudentForm from '~/components/students/one/edit-student-form';
import PersonalInfoForm from '~/components/students/one/personal-info-form';
import PropertiesSection from '~/components/students/one/properties-section';
import type { LocaleCode } from '~/locales/server.ts';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { api } from '~/server/clients/internal.ts';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import React from 'react';
import HeaderActions from './header-actions';

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
      >
        <HeaderActions />
      </PageHeader>
      <div className="flex h-full flex-col gap-6 @4xl:pt-6" id={MAIN_CONTENT}>
        <EditStudentForm properties={properties} />
      </div>
    </>
  );
}
