'use client';

import { Avatar, AvatarImage } from '@pedaki/design/ui/avatar';
import { Burger } from '@pedaki/design/ui/burger';
import { useGlobalStore } from '~/store/global.store.ts';
import { useSession } from 'next-auth/react';
import React, { Suspense } from 'react';

interface SidebarHeaderProps {
  collapsed: boolean;
}

const SidebarMobileHeader = ({ collapsed }: SidebarHeaderProps) => {
  const setCollapsed = useGlobalStore(state => state.setMobileOpen);

  return (
    <div className="-m-2 flex flex-col gap-2 rounded-2xl border bg-white p-2 sm:hidden ">
      <div className="flex items-center justify-between gap-2">
        <Burger active={collapsed} onClick={() => setCollapsed?.(!collapsed)} />
        <Suspense>
          <User />
        </Suspense>
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
