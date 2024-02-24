'use client';

import { Button } from '@pedaki/design/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@pedaki/design/ui/dialog';
import { IconSearch } from '@pedaki/design/ui/icons';
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

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="stroke-primary-main" size="xs" className="flex items-center space-x-0.5">
            <IconSearch className="h-4 pl-1 text-soft" />
            {/*TODO: trads*/}
            <span className="px-1 text-label-sm text-sub">Filtrer</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="h-[80%] overflow-y-hidden pt-12 md:max-w-screen-md lg:max-w-screen-lg 2xl:max-w-screen-xl"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <Client onDataChange={(_, meta) => setStudentsCount(meta.totalCount)} className="px-1" />
        </DialogContent>
      </Dialog>
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

  {/*TODO: trads*/}
  return <span>{value > 0 ? `${value} élèves sélectionnés` : 'Aucun élève sélectionné'}</span>;
};

export default SelectStudents;
