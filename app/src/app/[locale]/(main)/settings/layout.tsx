import { IconSettings } from '@pedaki/design/ui/icons';
import SettingsNavigation from '~/app/[locale]/(main)/settings/SettingsNavigation.tsx';
import type { LayoutType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import { getScopedI18n  } from '~/locales/server.ts';
import type {LocaleCode} from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { MAIN_CONTENT } from '~/store/tutorial/data/constants.ts';
import type { ResolvingMetadata } from 'next';
import React from 'react';

export const generateMetadata = async (
  { params }: { params: { locale: LocaleCode } },
  parent: ResolvingMetadata,
) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('settings.main');
  const parentMetadata = await parent;

  return {
    title: {
      template: t('metadata.title.template', { applicationName: parentMetadata.applicationName }),
    },
    description: t('metadata.description'),
  };
};

export default async function SettingsLayout({ children }: LayoutType) {
  const t = await getScopedI18n('settings.main');

  return (
    <>
      <PageHeader
        title={t('header.title')}
        description={t('header.description')}
        icon={IconSettings}
      />
      <SettingsNavigation />
      <div className="pt-6" id={MAIN_CONTENT}>
        {children}
      </div>
    </>
  );
}
