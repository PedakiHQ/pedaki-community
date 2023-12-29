import { IconBookUser, IconHome, IconUserGroups } from '@pedaki/design/ui/icons';
import type { SidebarLinkProps } from '~/components/layout/Sidebar/SidebarLink.tsx';
import SidebarLink from '~/components/layout/Sidebar/SidebarLink.tsx';
import { SIDEBAR_STUDENTS_BUTTON } from '~/store/tutorial/data/constants.ts';
import React from 'react';

const items = [
  {
    icon: IconHome,
    title: 'Accueil',
    href: '/',
    segment: '(index)',
  },
  {
    icon: IconUserGroups,
    iconClassName: 'h-[1.1rem] w-[1.1rem]',
    title: 'Eleves',
    segment: 'students',
    id: SIDEBAR_STUDENTS_BUTTON,
    items: [
      {
        title: 'Liste des eleves',
        href: '/students',
        segment: '(list)',
        id: `${SIDEBAR_STUDENTS_BUTTON}-list`,
      },
      {
        title: "Schéma d'élèves",
        href: '/students/schema',
        segment: 'schema',
        id: `${SIDEBAR_STUDENTS_BUTTON}-schema`,
      },
    ],
  },
  {
    icon: IconBookUser,
    title: 'Classes',
    segment: 'classes',
    items: [
      {
        title: 'Liste des classes',
        href: '/classes',
        segment: '(list)',
      },
      {
        title: 'Générer les classes',
        href: '/classes/generate',
        segment: 'generate',
      },
    ],
  },
] as SidebarLinkProps[];

const SidebarContent = () => {
  return (
    <div
      className="hidden flex-1 flex-col gap-1 group-data-[mobile-open=true]/sidebar:flex sm:flex"
      role="navigation"
      suppressHydrationWarning
    >
      {items.map((item, index) => (
        <SidebarLink key={index} {...item} />
      ))}
    </div>
  );
};

export default SidebarContent;
