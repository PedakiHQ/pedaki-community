'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { cn } from '@pedaki/design/utils';
import { useTutorialNextStep } from '~/components/tutorial/useTutorialNextStep.tsx';
import { useScopedI18n } from '~/locales/client';
import { SETTINGS_NAVIGATION, SETTINGS_NAVIGATION_USERS } from '~/store/tutorial/data/constants.ts';
import { TUTORIAL_ID as UserTutorialId } from '~/store/tutorial/data/users/constants.ts';
import { isActive } from '~/utils.ts';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import React from 'react';

const items = [
  {
    name: 'general',
    href: '/settings',
    segment: '(general)',
  },
  {
    name: 'billing',
    href: '/settings/billing',
    segment: 'billing',
  },
  {
    name: 'users',
    href: '/settings/users',
    segment: 'users',
    id: SETTINGS_NAVIGATION_USERS,
  },
  {
    name: 'account',
    href: '/settings/account',
    segment: 'account',
  },
] as const satisfies NavigationItem[];

interface NavigationItem {
  name: string;
  href: string;
  segment: string | null;
  id?: string;
}

const SettingsNavigation = () => {
  useTutorialNextStep(UserTutorialId, 0);

  return (
    <nav className="flex items-center gap-6 border-b" id={SETTINGS_NAVIGATION}>
      <MobileNavigation />
      <DesktopNavigation />
    </nav>
  );
};

const MobileNavigation = () => {
  const selectedSegment = useSelectedLayoutSegment();
  const currentItem = items.find(item => isActive(selectedSegment, item.segment));
  const t = useScopedI18n('settings.main.navigation.items');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="block py-3 @sm/main:hidden">
        <div>
          <span className="text-p-sm font-medium text-sub">
            {t(`${currentItem?.name ?? 'default'}.label`)}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        {items.map(item => {
          const active = isActive(selectedSegment, item.segment);
          return (
            <DropdownMenuItem key={item.href} disabled={active} asChild className="w-full">
              <Link href={item.href}>{t(`${item.name ?? 'default'}.label`)}</Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DesktopNavigation = () => {
  return (
    <>
      {items.map(item => (
        <Item {...item} key={item.href} />
      ))}
    </>
  );
};

const Item = ({ name, href, segment, id }: NavigationItem) => {
  const selectedSegment = useSelectedLayoutSegment();
  const active = isActive(selectedSegment, segment);
  const t = useScopedI18n('settings.main.navigation.items');

  return (
    <Link className="group relative hidden py-3 @sm/main:block" href={href} id={id}>
      <span
        className={cn(
          'text-p-sm font-medium text-sub ',
          active ? 'text-main' : 'group-hover:text-main',
        )}
      >
        {/* @ts-expect-error We can tolerate the error here, because in case of invalid name we would still get the error in MobileNavigation */}
        {t(`${name}.label`)}
      </span>
      {active && (
        <div className="absolute inset-x-0 -bottom-[0.065rem] h-0.5 bg-primary-base"></div>
      )}
    </Link>
  );
};

export default SettingsNavigation;
