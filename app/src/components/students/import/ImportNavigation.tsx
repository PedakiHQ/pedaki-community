'use client';

import { Navigation } from '~/components/HorizontalMenu/navigation.tsx';
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
  },
] as const;

export const ImportNavigation = ({ importId }: { importId: string }) => {
  const finalItems = items.map(item => ({
    ...item,
    href: `/students/import/${importId}${item.href}`,
  }));

  return <Navigation items={finalItems} tKey="students.import.navigation.items" id={'id'} />;
};
