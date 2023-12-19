'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { cn } from '@pedaki/design/utils';
import { useScopedI18n } from '~/locales/client';
import React from 'react';

const SideBarUserDropdown = ({
  children,
  align = 'center',
  side = 'right',
  triggerClassName = '',
}: {
  children: React.ReactNode;
  triggerClassName?: string;
  align?: React.ComponentProps<typeof DropdownMenuContent>['align'];
  side?: React.ComponentProps<typeof DropdownMenuContent>['side'];
}) => {
  const t = useScopedI18n('main.layout.sidebar.user');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn('focus-ring rounded-md', triggerClassName)}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side}>
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
  );
};

export default SideBarUserDropdown;
