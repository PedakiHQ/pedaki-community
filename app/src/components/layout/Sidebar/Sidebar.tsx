'use client';

import { TooltipProvider } from '@pedaki/design/ui/tooltip';
import { cn } from '@pedaki/design/utils';
import SidebarAltContent from '~/components/layout/Sidebar/SidebarAltContent.tsx';
import SidebarContent from '~/components/layout/Sidebar/SidebarContent.tsx';
import SidebarFooter from '~/components/layout/Sidebar/SidebarFooter.tsx';
import SidebarHeader from '~/components/layout/Sidebar/SidebarHeader.tsx';
import SidebarMobileHeader from '~/components/layout/Sidebar/SidebarMobileHeader.tsx';
import { env } from '~/env.ts';
import { I18nProviderClient } from '~/locales/client';
import { useGlobalStore } from '~/store/global/global.store.ts';
import React from 'react';

interface SidebarProps {
  locale: string;
}

const Sidebar = ({ locale }: SidebarProps) => {
  const collapsed = useGlobalStore(state => state.collapsed);
  const mobileOpen = useGlobalStore(state => state.mobileOpen);
  const demoBannerVisible = useGlobalStore(state => state.demoBannerVisible);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 sm:bg-transparent',
        'z-20',
        'peer',
        'w-full sm:w-[17rem] data-[collapsed=true]:sm:w-20',
        'data-[mobile-open=true]:inset-y-0 sm:inset-y-0',
        'group/sidebar',
        demoBannerVisible && env.NEXT_PUBLIC_IS_DEMO && 'mt-12',
        mobileOpen && 'bg-weak',
      )}
      data-collapsed={collapsed}
      data-mobile-open={mobileOpen}
    >
      <div className="relative flex h-full w-full flex-col gap-4 p-4">
        <TooltipProvider>
          <I18nProviderClient locale={locale}>
            <SidebarMobileHeader collapsed={mobileOpen} />
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
