import { IconSettings } from '@pedaki/design/ui/icons';
import SettingsNavigation from '~/app/[locale]/(main)/settings/SettingsNavigation.tsx';
import type { LayoutType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { fetchSettings } from '~/settings/fetch.ts';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale); // TODO: check if we need to put it in every page
  const settings = await fetchSettings();

  return {
    title: {
      template: `%s - settings - ${settings.name}`,
    },
  };
};

export default function SettingsLayout({ children, params }: LayoutType) {
  return (
    <>
      <PageHeader
        title="Paramètres"
        description="Gérer les paramètres de votre workspace."
        icon={IconSettings}
      />
      <SettingsNavigation />
      <div className="pt-6">{children}</div>
    </>
  );
}
