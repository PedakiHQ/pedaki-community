import { IconUserGroups } from '@pedaki/design/ui/icons';
import { Separator } from '@pedaki/design/ui/separator';
import type { PageType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import PersonalInfoForm from '~/components/students/one/personal-info-form.tsx';
import PropertiesSection from '~/components/students/one/properties-section.tsx';
import type { LocaleCode } from '~/locales/server.ts';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import { api } from '~/server/clients/internal.ts';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
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
      <div className="flex h-full flex-col gap-6 pt-6" id={MAIN_CONTENT}>
        <PersonalInfoForm />
        <Separator />
        <PropertiesSection initialProperties={initialProperties} />
      </div>
    </>
  );
}
