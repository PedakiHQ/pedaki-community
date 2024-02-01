'use client';

import { Skeleton } from '@pedaki/design/ui/skeleton';
import type { GetManyClassesOutput } from '@pedaki/services/classes/class.model.js';
import type { Field } from '@pedaki/services/classes/query.model.client';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/classes/list/data-table-column-header.tsx';
import type { UseScopedI18nType } from '~/locales/client.ts';
import type { OutputType } from '~api/router/router.ts';

export type ClassData = GetManyClassesOutput['data'][number];
export type ClassColumnDef = ColumnDef<ClassData> & {
  loadingCell?: ColumnDef<ClassData>['cell'];
  id: string;
  accessorKey: Field | null;
  title?: string;
};

const levelCell = (accessorKey: Field, name: string): ClassColumnDef => {
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

const defaultCell = (id: string, accessorKey: Field | null, name: string): ClassColumnDef => {
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
  t: UseScopedI18nType<'classes.list.table'>,
  {
    propertyMapping,
    classMapping,
    teacherMapping,
  }: {
    propertyMapping: OutputType['classes']['properties']['getMany'];
    classMapping: OutputType['classes']['getMany'];
    teacherMapping: OutputType['teachers']['getMany'];
  },
) => {
  const res: ClassColumnDef[] = [
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
