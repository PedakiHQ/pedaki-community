import { IconSettings } from '@pedaki/design/ui/icons';
import type { SidebarLinkProps } from '~/components/layout/Sidebar/SidebarLink.tsx';
import SidebarLink from '~/components/layout/Sidebar/SidebarLink.tsx';
import React from 'react';

const items = [
  {
    icon: IconSettings,
    title: 'Eleves',
    items: [
      {
        title: 'Liste des eleves',
        href: '/students',
      },
      {
        title: 'Child 2',
        href: '/a',
      },
      {
        title: 'Child 3',
        href: '/b',
      },
    ],
  },
  {
    icon: IconSettings,
    title: 'Classes',
    items: [
      {
        title: 'Child 1',
        href: '/',
      },
      {
        title: 'Child 2',
        href: '/c',
      },
      {
        title: 'Child 3',
        href: '/d',
      },
    ],
  },
] as SidebarLinkProps[];

const SidebarContent = () => {
  return (
    <div className="flex flex-1 flex-col gap-1" role="navigation" suppressHydrationWarning>
      {items.map((item, index) => (
        <SidebarLink key={index} {...item} />
      ))}
    </div>
  );
};

export default SidebarContent;
