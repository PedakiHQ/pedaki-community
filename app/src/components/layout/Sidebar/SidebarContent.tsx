import { IconBookUser, IconHome, IconUserGroups } from '@pedaki/design/ui/icons';
import type { SidebarLinkProps } from '~/components/layout/Sidebar/SidebarLink.tsx';
import SidebarLink from '~/components/layout/Sidebar/SidebarLink.tsx';
import { useScopedI18n } from '~/locales/client';
import {
  SIDEBAR_CLASSES_BUTTON,
  SIDEBAR_STUDENTS_BUTTON,
} from '~/store/tutorial/data/constants.ts';
import React from 'react';

const SidebarContent = () => {
  const t = useScopedI18n('main.layout.sidebar.content');
  const items = [
    {
      icon: IconHome,
      title: t('home.title'),
      href: '/',
      segment: '(index)',
    },
    {
      icon: IconUserGroups,
      iconClassName: 'h-[1.1rem] w-[1.1rem]',
      title: t('students.title'),
      segment: 'students',
      id: SIDEBAR_STUDENTS_BUTTON,
      items: [
        {
          title: t('students.items.list.title'),
          href: '/students',
          segment: '(list)',
          id: `${SIDEBAR_STUDENTS_BUTTON}-list`,
        },
        {
          title: t('students.items.schema.title'),
          href: '/students/schema',
          segment: 'schema',
          id: `${SIDEBAR_STUDENTS_BUTTON}-schema`,
        },
      ],
    },
    {
      icon: IconBookUser,
      title: t('students.title'),
      segment: 'classes',
      id: SIDEBAR_CLASSES_BUTTON,
      items: [
        {
          title: t('classes.items.list.title'),
          href: '/classes',
          segment: '(list)',
          id: `${SIDEBAR_CLASSES_BUTTON}-list`,
        },
        {
          title: t('classes.items.generate.title'),
          href: '/classes/generate',
          segment: 'generate',
          id: `${SIDEBAR_CLASSES_BUTTON}-generate`,
        },
      ],
    },
  ] as SidebarLinkProps[];

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
