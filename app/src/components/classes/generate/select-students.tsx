'use client';

import { Button } from '@pedaki/design/ui/button';
import { IconSearch } from '@pedaki/design/ui/icons';
import { Sheet, SheetContent, SheetTrigger } from '@pedaki/design/ui/sheet';
import { useFilterParams } from '~/components/datatable/client.tsx';
import Client from '~/components/students/list/client.tsx';
import { searchParams } from '~/components/students/list/parameters.ts';
import { api } from '~/server/clients/client.ts';
import { useClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import React, { useRef } from 'react';

const SelectStudents = () => {
  const setStudentsCount = useClassesGenerateStore(state => state.setStudentsCount);

  return (
    <div className="flex items-center justify-between">
      <StudentCount />

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="stroke-primary-main" size="sm" className="flex items-center space-x-2">
            <IconSearch className="h-4 text-soft" />
            <span>Filtrer</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <div className="h-full pt-8">
            <Client onDataChange={(_, meta) => setStudentsCount(meta.totalCount)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const StudentCount = () => {
  const [filters] = useFilterParams(searchParams);
  const lock = useRef(false);
  const studentsCount = useClassesGenerateStore(state => state.studentsCount);

  const { data } = api.students.getMany.useQuery(
    {
      fields: [],
      where: filters,
      pagination: {
        page: 1,
        limit: 1,
      },
    },
    {
      enabled: !lock.current,
    },
  );

  if (data?.meta.totalCount && !lock.current) {
    lock.current = true;
  }

  const value = studentsCount ?? (data?.meta.totalCount && lock.current ? data.meta.totalCount : 0);

  return <span>{value > 0 ? `${value} élèves sélectionnés` : 'Aucun élève sélectionné'}</span>;
};

export default SelectStudents;
