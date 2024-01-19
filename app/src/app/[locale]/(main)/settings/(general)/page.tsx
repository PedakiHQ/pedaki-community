import { Separator } from '@pedaki/design/ui/separator';
import AppearanceForm from '~/app/[locale]/(main)/settings/(general)/appearance-form.tsx';
import GeneralForm from '~/app/[locale]/(main)/settings/(general)/general-form.tsx';
import SettingRow from '~/app/[locale]/(main)/settings/SettingRow.tsx';
import type { PageType } from '~/app/types';
import { getScopedI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { APPEARANCE_FORM } from '~/store/tutorial/data/appearance/constants.ts';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('settings.general');

  return {
    title: t('metadata.title'),
  };
};

export default async function GeneralSettingsPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);
  const t = await getScopedI18n('settings.general');

  return (
    <div className="flex flex-col gap-5">
      <SettingRow title={t('rows.general.title')} description={t('rows.general.description')}>
        <GeneralForm />
      </SettingRow>
      <Separator />
      <SettingRow
        title={t('rows.appearance.title')}
        description={t('rows.appearance.description')}
        id={APPEARANCE_FORM}
      >
        <AppearanceForm />
      </SettingRow>
    </div>
  );
}
