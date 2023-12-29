import { Separator } from '@pedaki/design/ui/separator';
import AppearanceForm from '~/app/[locale]/(main)/settings/(general)/appearance-form.tsx';
import GeneralForm from '~/app/[locale]/(main)/settings/(general)/general-form.tsx';
import SettingRow from '~/app/[locale]/(main)/settings/SettingRow.tsx';
import { getI18n } from '~/locales/server.ts';
import type { LocaleCode } from '~/locales/server.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import { APPEARANCE_FORM } from '~/store/tutorial/data/appearance/constants.ts';
import React from 'react';

export const generateMetadata = async ({ params }: { params: { locale: LocaleCode } }) => {
  setStaticParamsLocale(params.locale);
  const t = await getI18n();

  return {
    title: t('metadata.title'),
  };
};

export default function GeneralSettingsPage() {
  return (
    <div className="flex flex-col gap-5">
      <SettingRow title="Général" description="Paramètres généraux du workspace.">
        <GeneralForm />
      </SettingRow>
      <Separator />
      <SettingRow
        title="Apparence"
        description="Paramètres d'apparence du workspace."
        id={APPEARANCE_FORM}
      >
        <AppearanceForm />
      </SettingRow>
    </div>
  );
}
