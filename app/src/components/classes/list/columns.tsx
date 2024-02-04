'use client';

import type { GetManyClassesOutput } from '@pedaki/services/classes/class.model.js';
import type { Field } from '@pedaki/services/classes/query.model.client';
import { defaultCell } from '~/components/datatable/columns';
import type { ColumnDef } from '~/components/datatable/columns';
import type { UseScopedI18nType } from '~/locales/client.ts';
import type { OutputType } from '~api/router/router.ts';

export type ClassData = GetManyClassesOutput['data'][number];
export type ClassColumnDef = ColumnDef<ClassData, Field>;

export const generateColumns = (
  t: UseScopedI18nType<'classes.list.table'>,
  {
    teacherMapping,
  }: {
    teacherMapping: OutputType['teachers']['getMany'];
  },
) => {
  const res: ClassColumnDef[] = [
    defaultCell<ClassColumnDef>('name', 'name', t('columns.name.label')),
    defaultCell<ClassColumnDef>('description', 'description', t('columns.description.label')),
    defaultCell<ClassColumnDef>(
      'academicYear.name',
      'academicYear.name',
      t('columns.academicYear.label'),
    ),
    defaultCell<ClassColumnDef>('level.name', 'level.name', t('columns.level.label')),
    {
      ...defaultCell<ClassColumnDef>(
        'mainTeacher.name',
        `mainTeacher.id`,
        t('columns.mainTeacher.label'),
      ),
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
