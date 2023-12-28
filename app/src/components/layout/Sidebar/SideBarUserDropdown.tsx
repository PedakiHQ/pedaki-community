'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { IconLogout, IconSettings, IconTranslation } from '@pedaki/design/ui/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@pedaki/design/ui/tooltip';
import { LocaleItem } from '~/components/LanguageSelector/LocaleItem.tsx';
import { useScopedI18n } from '~/locales/client';
import { locales } from '~/locales/shared.ts';
import { useGlobalStore } from '~/store/global/global.store.ts';
import { useIsSmall } from '~/utils.ts';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { Suspense } from 'react';

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

        <DropdownMenuItem asChild>
          <Link href="/settings/account" className="w-full" prefetch={false}>
            <IconSettings className="h-4 w-4" />
            <span>{t('dropdown.settings')}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IconTranslation className="h-4 w-4" />
            <span>{t('dropdown.language')}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {locales.map(locale => {
                return (
                  <Suspense key={locale}>
                    <LocaleItem locale={locale} />
                  </Suspense>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            await signOut();
          }}
        >
          <IconLogout className="h-4 w-4" />
          {t('dropdown.signout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SideBarUserDropdown;
