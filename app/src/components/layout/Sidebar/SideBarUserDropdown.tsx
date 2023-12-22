'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@pedaki/design/ui/tooltip';
import { useScopedI18n } from '~/locales/client';
import { useGlobalStore } from '~/store/global.store.ts';
import { useIsSmall } from '~/utils.ts';
import { signOut } from 'next-auth/react';
import React from 'react';

const SideBarUserDropdown = ({
  children,
  align = 'center',
  side = 'right',
}: {
  children: React.ReactNode;
  align?: React.ComponentProps<typeof DropdownMenuContent>['align'];
  side?: React.ComponentProps<typeof DropdownMenuContent>['side'];
}) => {
  const t = useScopedI18n('main.layout.sidebar.user');
  const isSmall = useIsSmall();
  const collapsed = useGlobalStore(state => state.collapsed);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-ring rounded-md sm:w-full">
        <Tooltip open={collapsed && !isSmall ? undefined : false}>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent side="right" align="center">
            {t('dropdown.label')}
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side}>
        <DropdownMenuLabel>{t('dropdown.label')}</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
          }}
        >
          {t('dropdown.signout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SideBarUserDropdown;
