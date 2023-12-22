'use client';

import { cn } from '@pedaki/design/utils';
import { isActive } from '~/utils.ts';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import React from 'react';

const items = [
  {
    title: 'General',
    href: '/settings',
    segment: null,
  },
  {
    title: 'Bidule',
    href: '/settings/bidule',
    segment: 'bidule',
  },
  {
    title: 'Truc',
    href: '/settings/truc',
    segment: 'truc',
  },
  {
    title: 'Chose',
    href: '/settings/chose',
    segment: 'chose',
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
      {items.map(item => (
        <Item {...item} key={item.href} />
      ))}
    </nav>
  );
};

const Item = ({ title, href, segment }: NavigationItem) => {
  const selectedSegment = useSelectedLayoutSegment();
  const active = isActive(selectedSegment, segment);

  return (
    <Link className="group relative py-3" href={href}>
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
