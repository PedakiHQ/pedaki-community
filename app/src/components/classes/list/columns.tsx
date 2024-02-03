'use client';

import { Skeleton } from '@pedaki/design/ui/skeleton';
import type { GetManyClassesOutput } from '@pedaki/services/classes/class.model.js';
import type { Field } from '@pedaki/services/classes/query.model.client';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/datatable/data-table-column-header.tsx';
import type { UseScopedI18nType } from '~/locales/client.ts';
import type { OutputType } from '~api/router/router.ts';

export type ClassData = GetManyClassesOutput['data'][number];
export type ClassColumnDef = ColumnDef<ClassData> & {
  loadingCell?: ColumnDef<ClassData>['cell'];
  id: string;
  accessorKey: Field | null;
  title?: string;
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
    teacherMapping,
  }: {
    teacherMapping: OutputType['teachers']['getMany'];
  },
) => {
  const res: ClassColumnDef[] = [
    defaultCell('name', 'name', t('columns.name.label')),
    defaultCell('description', 'description', t('columns.description.label')),
    defaultCell('academicYear.name', 'academicYear.name', t('columns.academicYear.label')),
    defaultCell('level.name', 'level.name', t('columns.level.label')),
    {
      ...defaultCell('mainTeacher.name', `mainTeacher.id`, t('columns.mainTeacher.label')),
      cell: ({ row }) => {
        const data = row.original;
        if (data.mainTeacher && teacherMapping[data.mainTeacher.id!]?.name) {
          return <div>{teacherMapping[data.mainTeacher.id!]?.name}</div>;
        }
        return <div>-</div>;
      },
    },
  ];

  return res;
};
