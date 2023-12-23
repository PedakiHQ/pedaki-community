import { Separator } from '@pedaki/design/ui/separator';
import AppearanceForm from '~/app/[locale]/(main)/settings/(general)/appearance-form.tsx';
import GeneralForm from '~/app/[locale]/(main)/settings/(general)/general-form.tsx';
import SettingRow from '~/app/[locale]/(main)/settings/SettingRow.tsx';
import type { PageType } from '~/app/types.ts';
import React from 'react';

export default function GeneralSettingsPage({ params }: PageType) {
  return (
    <div className="flex flex-col gap-5">
      <SettingRow
        title="Général"
        description="Paramètres généraux du workspace. Ces informations sont partagées avec pedaki."
      >
        <GeneralForm />
      </SettingRow>
      <Separator />
      <SettingRow title="Apparence" description="Paramètres d'apparence du workspace.">
        <AppearanceForm />
      </SettingRow>
    </div>
  );
}
