'use client';

import { Navigation } from '~/components/HorizontalMenu/navigation.tsx';
import { STUDENTS_IMPORT_PAGE_BUTTON } from '~/store/tutorial/data/upload-students/constants.ts';
import React from 'react';

const items = [
  {
    labelKey: 'classes',
    href: '/',
    segment: '(classes)',
  },
  {
    labelKey: 'students',
    href: '/students',
    segment: 'students',
    id: STUDENTS_IMPORT_PAGE_BUTTON,
  },
] as const;

export const ImportNavigation = ({ importId }: { importId: string }) => {
  const finalItems = items.map(item => ({
    ...item,
    href: `/students/import/${importId}${item.href}`,
  }));

  return <Navigation items={finalItems} tKey="students.import.navigation.items" id={'id'} />;
};
