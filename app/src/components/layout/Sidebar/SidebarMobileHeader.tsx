'use client';

import { Avatar, AvatarImage } from '@pedaki/design/ui/avatar';
import { Burger } from '@pedaki/design/ui/burger';
import SideBarUserDropdown from '~/components/layout/Sidebar/SideBarUserDropdown';
import { useGlobalStore } from '~/store/global/global.store.ts';
import { useWorkspaceStore } from '~/store/workspace/workspace.store.ts';
import { useSession } from 'next-auth/react';
import React, { Suspense } from 'react';

interface SidebarHeaderProps {
  collapsed: boolean;
}

const SidebarMobileHeader = ({ collapsed }: SidebarHeaderProps) => {
  const setCollapsed = useGlobalStore(state => state.setMobileOpen);
  const workspaceName = useWorkspaceStore(state => state.settings.name);

  return (
    <div className="-m-2 flex flex-col gap-2 rounded-2xl border bg-white px-4 py-2 sm:hidden ">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Burger active={collapsed} onClick={() => setCollapsed?.(!collapsed)} />
          <span className="max-w-[30ch] overflow-hidden overflow-ellipsis text-label-sm font-medium">
            {workspaceName}
          </span>
        </div>
        <SideBarUserDropdown align="end" side="bottom">
          <Suspense>
            <User />
          </Suspense>
        </SideBarUserDropdown>
      </div>
    </div>
  );
};

const User = () => {
  const { data } = useSession();

  return (
    <Avatar className="h-8 w-8 shrink-0">
      <AvatarImage src={data?.user.image} alt={data?.user.name ?? 'user'} />
    </Avatar>
  );
};

export default SidebarMobileHeader;
