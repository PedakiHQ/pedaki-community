import { IconBookText, IconSettings } from '@pedaki/design/ui/icons';
import SidebarLink from '~/components/layout/Sidebar/SidebarLink.tsx';
import { useScopedI18n } from '~/locales/client.ts';
import React from 'react';

const SidebarAltContent = () => {
  const t = useScopedI18n('main.layout.sidebar.alt');
  return (
    <div className="">
      <SidebarLink href="/settings" icon={IconSettings} title={t('settings')} />
      <SidebarLink href="https://docs.pedaki.fr" icon={IconBookText} title={t('documentation')} />
    </div>
  );
};

export default SidebarAltContent;
