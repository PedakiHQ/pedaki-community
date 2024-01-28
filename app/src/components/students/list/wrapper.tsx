'use server';

import { api } from '~/server/clients/server.ts';
import StoreProvider from '~/store/students/list/StoreProvider.tsx';
import React from 'react';

interface StudentsListWrapperProps {
  children: React.ReactNode;
}

const StudentsListWrapper = async ({ children }: StudentsListWrapperProps) => {
  const [propertyMapping, classMapping, teacherMapping] = await Promise.all([
    api.students.properties.getMany.query(),
    api.classes.getMany.query(),
    api.teachers.getMany.query(),
  ]);
  return (
    <StoreProvider
      propertyMapping={propertyMapping}
      classMapping={classMapping}
      teacherMapping={teacherMapping}
    >
      {children}
    </StoreProvider>
  );
};

export default StudentsListWrapper;
