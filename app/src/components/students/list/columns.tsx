'use client';

import { Skeleton } from '@pedaki/design/ui/skeleton';
import type { Field } from '@pedaki/services/students/query.model.client';
import type { GetManyStudentsOutput } from '@pedaki/services/students/student.model.js';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/students/list/data-table-column-header.tsx';
import type { UseScopedI18nType } from '~/locales/client.ts';
import type { OutputType } from '~api/router/router.ts';

export type StudentData = GetManyStudentsOutput['data'][number];
export type StudentColumnDef = ColumnDef<StudentData> & {
  loadingCell?: ColumnDef<StudentData>['cell'];
  id: string;
  accessorKey: Field | null;
  title?: string;
};

const levelCell = (accessorKey: Field, name: string): StudentColumnDef => {
  // number between 0 and 100
  return {
    id: accessorKey,
    accessorKey,
    title: name,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={name} />;
    },
    loadingCell: () => {
      return <Skeleton className="h-4 w-20" />;
    },
  };
};

const defaultCell = (id: string, accessorKey: Field | null, name: string): StudentColumnDef => {
  return {
    id,
    accessorKey,
    title: name,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title={name} />;
    },
    loadingCell: () => {
      return <Skeleton className="h-4 w-20" />;
    },
  };
};

export const generateColumns = (
  t: UseScopedI18nType<'students.list.table'>,
  {
    propertyMapping,
    classMapping,
    teacherMapping,
  }: {
    propertyMapping: OutputType['students']['properties']['getMany'];
    classMapping: OutputType['classes']['getMany'];
    teacherMapping: OutputType['teachers']['getMany'];
  },
) => {
  const res: StudentColumnDef[] = [
    defaultCell('firstName', 'firstName', t('columns.firstName.label')),
    defaultCell('lastName', 'lastName', t('columns.lastName.label')),
    {
      ...defaultCell('class.name', `class.id`, t('columns.class.label')),
      cell: ({ row }) => {
        const data = row.original;
        return <div>{classMapping[data.class.id!]?.name ?? '-'}</div>;
      },
    },
    {
      ...defaultCell(`class.teachers.name`, `class.teachers.id`, t('columns.teachers.label')),
      cell: ({ row }) => {
        const data = row.original;
        const teachers = data.class.teachers
          ?.map(({ id }) => id && teacherMapping[id]?.name)
          .filter(Boolean)
          .join(', ');
        return <div>{teachers ?? '-'}</div>;
      },
    },
  ];

  // add all properties cell
  Object.entries(propertyMapping).forEach(([key, value]) => {
    if (value.type === 'LEVEL') {
      // TODO: add mapping
      res.push(levelCell(`properties.${key}`, value.name));
    } else {
      res.push(defaultCell(`properties.${key}`, `properties.${key}`, value.name));
    }
  });

  return res;
};
