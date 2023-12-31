'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@pedaki/design/ui/avatar';
import { Skeleton } from '@pedaki/design/ui/skeleton';
import SideBarUserDropdown from '~/components/layout/Sidebar/SideBarUserDropdown';
import { useSession } from 'next-auth/react';
import React from 'react';

const SidebarFooterUser = () => {
  const { data } = useSession();

  return (
    <div className="rounded-md pt-2">
      <SideBarUserDropdown align="end">
        <div className="flex w-full items-center gap-4 rounded-md px-4 py-2 hover:bg-white data-[state=open]:bg-white group-data-[collapsed=true]/sidebar:justify-center">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={data?.user.image} alt={data?.user.name ?? 'user'} />
            <AvatarFallback>
              <Skeleton className="h-8 w-8 bg-neutral-300">&nbsp;</Skeleton>
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-left group-data-[collapsed=true]/sidebar:hidden">
            {data && (
              <>
                <p className="text-label-sm font-medium">{data.user.name}</p>
                <p className="max-w-[20ch] overflow-hidden overflow-ellipsis text-p-xs text-sub">
                  {data.user.email}
                </p>
              </>
            )}
            {!data && (
              <>
                <Skeleton className="w-[10ch] bg-neutral-300 text-label-sm font-medium">
                  &nbsp;
                </Skeleton>
                <Skeleton className="max-w-[20ch] overflow-hidden bg-neutral-300 text-p-xs text-sub">
                  &nbsp;
                </Skeleton>
              </>
            )}
          </div>
        </div>
      </SideBarUserDropdown>
    </div>
  );
};

export default SidebarFooterUser;
