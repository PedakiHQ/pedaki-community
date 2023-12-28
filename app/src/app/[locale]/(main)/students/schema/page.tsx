import { IconUserGroups } from '@pedaki/design/ui/icons';
import type { PageType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import { getI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getI18n();

  return {
    title: t('metadata.title'),
  };
};

export default function StudentSchemaPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);

  return (
    <>
      <PageHeader
        title="Liste des élèves"
        description="Gérer les paramètres de votre workspace."
        icon={IconUserGroups}
      />
    </>
  );
}
