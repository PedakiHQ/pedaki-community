'use server';

import { api } from '~/server/clients/internal.ts';
import StoreProvider from '~/store/classes/list/StoreProvider.tsx';
import React from 'react';

interface ClassesListWrapperProps {
  children: React.ReactNode;
}

const ClassesListWrapper = async ({ children }: ClassesListWrapperProps) => {
  const [teacherMapping, academicYearMapping, classBranchMapping, classLevelMapping] =
    await Promise.all([
      api.teachers.getMany.query(),
      api.academicYear.getMany.query(),
      api.classes.branches.getMany.query(),
      api.classes.levels.getMany.query(),
    ]);
  return (
    <StoreProvider
      teacherMapping={teacherMapping}
      academicYearMapping={academicYearMapping}
      classBranchMapping={classBranchMapping}
      classLevelMapping={classLevelMapping}
    >
      {children}
    </StoreProvider>
  );
};

export default ClassesListWrapper;
