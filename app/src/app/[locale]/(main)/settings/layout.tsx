import { IconSettings } from '@pedaki/design/ui/icons';
import SettingsNavigation from '~/app/[locale]/(main)/settings/SettingsNavigation.tsx';
import type { LayoutType } from '~/app/types.ts';
import PageHeader from '~/components/PageHeader.tsx';
import React from 'react';

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
