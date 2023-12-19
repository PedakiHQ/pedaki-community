'use client';

import { Avatar, AvatarImage } from '@pedaki/design/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { Skeleton } from '@pedaki/design/ui/skeleton';
import { useScopedI18n } from '~/locales/client';
import { useSession } from 'next-auth/react';
import React from 'react';

const SidebarFooterUser = () => {
  const { data } = useSession();
  const t = useScopedI18n('main.layout.sidebar.user');

  return (
    <div className="flex flex-col gap-2 group-data-[collapsed=true]/sidebar:items-center">
      <div className="rounded-md p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus-ring w-full rounded-md">
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="right">
            <DropdownMenuLabel>{t('dropdown.label')}</DropdownMenuLabel>
            {/* TODO: make signout work */}
            <DropdownMenuItem
              onClick={() => {
                console.log('signout');
                // 'use server';
                // await signOut();
              }}
            >
              {t('dropdown.signout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SidebarFooterUser;
