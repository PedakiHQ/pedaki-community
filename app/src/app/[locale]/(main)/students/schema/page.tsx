import { IconUserGroups } from '@pedaki/design/ui/icons';
import Bidule from '~/app/[locale]/(main)/students/schema/bidule.tsx';
import type { PageType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import type { LocaleCode } from '~/locales/server.ts';
import { getScopedI18n } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('students.list');

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
  };
};

export default async function StudentSchemaPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('students.list');

  return (
    <>
      <PageHeader
        title={t('header.title')}
        description={t('header.description')}
        icon={IconUserGroups}
      />
      <div className="pt-6" id={MAIN_CONTENT}>
        <Bidule />
      </div>
    </>
  );
}
