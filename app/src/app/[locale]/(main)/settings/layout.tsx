import { IconSettings } from '@pedaki/design/ui/icons';
import SettingsNavigation from '~/app/[locale]/(main)/settings/SettingsNavigation.tsx';
import type { LayoutType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import type { ResolvingMetadata } from 'next';
import React from 'react';

export const generateMetadata = async (
  { params }: { params: { locale: LocaleCode } },
  parent: ResolvingMetadata,
) => {
  setStaticParamsLocale(params.locale); // TODO: check if we need to put it in every page

  const parentMetadata = await parent;

  return {
    title: {
      template: `%s - settings - ${parentMetadata.applicationName}`,
    },
  };
};

export default function SettingsLayout({ children }: LayoutType) {
  return (
    <>
      <PageHeader
        title="Paramètres"
        description="Gérer les paramètres de votre workspace."
        icon={IconSettings}
      />
      <SettingsNavigation />
      <div className="pt-6" id={MAIN_CONTENT}>
        {children}
      </div>
    </>
  );
}
