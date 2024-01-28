import { IconBookText, IconSettings } from '@pedaki/design/ui/icons';
import SidebarLink from '~/components/layout/Sidebar/SidebarLink.tsx';
import { useScopedI18n } from '~/locales/client.ts';
import { SIDEBAR_SETTINGS_BUTTON } from '~/store/tutorial/data/constants.ts';
import React from 'react';

const SidebarAltContent = () => {
  const t = useScopedI18n('main.layout.sidebar.altContent');
  return (
    <div className="hidden flex-col gap-1 group-data-[mobile-open=true]/sidebar:flex sm:flex">
      <SidebarLink
        href="/settings"
        icon={IconSettings}
        title={t('settings')}
        segment="settings"
        id={SIDEBAR_SETTINGS_BUTTON}
      />
      <SidebarLink
        href="https://docs.pedaki.fr"
        icon={IconBookText}
        title={t('documentation')}
        segment="docs"
      />
    </div>
  );
};

export default SidebarAltContent;
