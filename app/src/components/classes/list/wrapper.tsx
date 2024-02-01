'use server';

import { api } from '~/server/clients/internal.ts';
import StoreProvider from '~/store/classes/list/StoreProvider.tsx';
import React from 'react';

interface ClassesListWrapperProps {
  children: React.ReactNode;
}

const ClassesListWrapper = async ({ children }: ClassesListWrapperProps) => {
  const [teacherMapping] = await Promise.all([api.teachers.getMany.query()]);
  return <StoreProvider teacherMapping={teacherMapping}>{children}</StoreProvider>;
};

export default ClassesListWrapper;
