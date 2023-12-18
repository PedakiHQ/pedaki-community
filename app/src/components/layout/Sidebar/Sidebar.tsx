'use client';

import { TooltipProvider } from '@pedaki/design/ui/tooltip';
import { cn } from '@pedaki/design/utils';
import SidebarAltContent from '~/components/layout/Sidebar/SidebarAltContent.tsx';
import SidebarContent from '~/components/layout/Sidebar/SidebarContent.tsx';
import SidebarFooter from '~/components/layout/Sidebar/SidebarFooter.tsx';
import SidebarHeader from '~/components/layout/Sidebar/SidebarHeader.tsx';
import { I18nProviderClient } from '~/locales/client';
import { useGlobalStore } from '~/store/global.store.ts';
import React from 'react';

interface SidebarProps {
  locale: string;
}

const Sidebar = ({ locale }: SidebarProps) => {
  const collapsed = useGlobalStore(state => state.collapsed);

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0',
        'peer shrink-0',
        'w-[17rem] data-[collapsed=true]:w-20',
        'group/sidebar',
      )}
      data-collapsed={collapsed}
    >
      <div className="relative flex h-full w-full flex-col gap-4 p-4">
        <TooltipProvider>
          <I18nProviderClient locale={locale}>
            <SidebarHeader collapsed={collapsed} />
            <SidebarContent />
            <SidebarAltContent />
            <SidebarFooter />
          </I18nProviderClient>
        </TooltipProvider>
      </div>
    </aside>
  );
};

export default Sidebar;
