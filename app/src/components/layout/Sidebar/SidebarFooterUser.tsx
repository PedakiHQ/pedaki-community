'use client';

import { Avatar, AvatarImage } from '@pedaki/design/ui/avatar';
import { Skeleton } from '@pedaki/design/ui/skeleton';
import SideBarUserDropdown from '~/components/layout/Sidebar/SideBarUserDropdown';
import { useSession } from 'next-auth/react';
import React from 'react';

const SidebarFooterUser = () => {
  const { data } = useSession();

  return (
    <div className="flex flex-col gap-2 group-data-[collapsed=true]/sidebar:items-center">
      <div className="rounded-md p-4">
        <SideBarUserDropdown triggerClassName="w-full">
          <div className="flex h-10 items-center gap-4">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={data?.user.image} alt={data?.user.name ?? 'user'} />
            </Avatar>
            <div className="space-y-1 text-left group-data-[collapsed=true]/sidebar:hidden">
              {data && (
                <>
                  <p className="text-label-sm font-medium">{data.user.name}</p>
                  <p className="w-[25ch] overflow-hidden overflow-ellipsis text-p-xs text-sub">
                    {data.user.email}
                  </p>
                </>
              )}
              {!data && (
                <>
                  <Skeleton className="w-[10ch] text-label-sm font-medium">&nbsp;</Skeleton>
                  <Skeleton className="w-[25ch] text-p-xs text-sub">&nbsp;</Skeleton>
                </>
              )}
            </div>
          </div>
        </SideBarUserDropdown>
      </div>
    </div>
  );
};

export default SidebarFooterUser;
