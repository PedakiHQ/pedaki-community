'use client';

import { Avatar, AvatarImage } from '@pedaki/design/ui/avatar';
import { Skeleton } from '@pedaki/design/ui/skeleton';
import { useSession } from 'next-auth/react';
import React from 'react';

const SidebarFooterUser = () => {
  const { data } = useSession();

  if (!data?.user) return <Fallback />;

  return (
    <div className="flex flex-col gap-2 group-data-[collapsed=true]/sidebar:items-center">
      <div className="rounded-md p-4">
        <div className="flex h-10 items-center gap-4">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={data.user.image!} alt={data.user.name!} />
          </Avatar>
          <div className="space-y-1 group-data-[collapsed=true]/sidebar:hidden">
            <p className="text-label-sm font-medium">{data.user.name}</p>
            <p className="w-[25ch] overflow-hidden overflow-ellipsis text-p-xs text-sub">
              {data.user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Fallback = () => {
  return (
    <div className="flex flex-col gap-2 group-data-[collapsed=true]/sidebar:items-center">
      <div className="rounded-md p-4">
        <div className="flex h-10 items-center gap-4">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="space-y-1 group-data-[collapsed=true]/sidebar:hidden">
            <Skeleton className="w-[10ch] text-label-sm font-medium">&nbsp;</Skeleton>
            <Skeleton className="w-[25ch] text-p-xs text-sub">&nbsp;</Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarFooterUser;
