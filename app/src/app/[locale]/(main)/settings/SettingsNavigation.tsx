'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { cn } from '@pedaki/design/utils';
import { isActive } from '~/utils.ts';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import React from 'react';

const items = [
  {
    title: 'General',
    href: '/settings',
    segment: '(general)',
  },
  {
    title: 'Abonnement',
    href: '/settings/billing',
    segment: 'billing',
  },
  {
    title: 'Utilisateurs',
    href: '/settings/users',
    segment: 'users',
  },
  {
    title: 'Mon compte',
    href: '/settings/account',
    segment: 'account',
  },
] satisfies NavigationItem[];

interface NavigationItem {
  title: string;
  href: string;
  segment: string | null;
}

const SettingsNavigation = () => {
  return (
    <nav className="flex items-center gap-6 border-b">
      <MobileNavigation />
      <DesktopNavigation />
    </nav>
  );
};

const MobileNavigation = () => {
  const selectedSegment = useSelectedLayoutSegment();
  const currentItem = items.find(item => isActive(selectedSegment, item.segment));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="block py-3 @sm/main:hidden">
        <div>
          <span className="text-p-sm font-medium text-sub">{currentItem?.title ?? 'Settings'}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        {items.map(item => {
          const active = isActive(selectedSegment, item.segment);
          return (
            <DropdownMenuItem key={item.href} disabled={active} asChild className="w-full">
              <Link href={item.href}>{item.title}</Link>
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

const Item = ({ title, href, segment }: NavigationItem) => {
  const selectedSegment = useSelectedLayoutSegment();
  const active = isActive(selectedSegment, segment);

  return (
    <Link className="group relative hidden py-3 @sm/main:block" href={href}>
      <span
        className={cn(
          'text-p-sm font-medium text-sub ',
          active ? 'text-main' : 'group-hover:text-main',
        )}
      >
        {title}
      </span>
      {active && (
        <div className="absolute inset-x-0 -bottom-[0.065rem] h-0.5 bg-primary-base"></div>
      )}
    </Link>
  );
};

export default SettingsNavigation;
