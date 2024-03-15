'use client';

import type { GetPaginatedManyClassesOutput } from '@pedaki/services/classes/class.model.js';
import type { Field } from '@pedaki/services/classes/query.model.client';
import { defaultCell } from '~/components/datatable/columns';
import type { ColumnDef } from '~/components/datatable/columns';
import type { UseScopedI18nType } from '~/locales/client.ts';
import type { OutputType } from '~api/router/router.ts';

export type ClassData = GetPaginatedManyClassesOutput['data'][number];
export type ClassColumnDef = ColumnDef<ClassData, Field>;

export const generateColumns = (
  t: UseScopedI18nType<'classes.list.table'>,
  {
    teacherMapping,
    academicYearMapping,
    classBranchMapping,
    classLevelMapping,
  }: {
    teacherMapping: OutputType['teachers']['getMany'];
    academicYearMapping: OutputType['academicYear']['getMany'];
    classBranchMapping: OutputType['classes']['branches']['getMany'];
    classLevelMapping: OutputType['classes']['levels']['getMany'];
  },
) => {
  const res: ClassColumnDef[] = [
    defaultCell<ClassColumnDef>('name', 'name', t('columns.name.label')),
    {
      ...defaultCell<ClassColumnDef>(
        'academicYear.name',
        'academicYear.id',
        t('columns.academicYear.label'),
      ),
      cell: ({ row }) => {
        const data = row.original;
        if (data.academicYear && academicYearMapping[data.academicYear.id]?.name) {
          return <div>{academicYearMapping[data.academicYear.id]?.name}</div>;
        }
        return <div>-</div>;
      },
    },
    {
      ...defaultCell<ClassColumnDef>('level.name', 'level.id', t('columns.level.label')),
      cell: ({ row }) => {
        const data = row.original;
        if (data.level && classLevelMapping[data.level.id]?.name) {
          return <div>{classLevelMapping[data.level.id]?.name}</div>;
        }
        return <div>-</div>;
      },
    },
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
    {
      ...defaultCell<ClassColumnDef>(`branches.name`, `branches.id`, t('columns.branches.label')),
      cell: ({ row }) => {
        const data = row.original;
        const branches = data.branches
          ?.map(({ id }) => id && classBranchMapping[id]?.name)
          .filter(Boolean)
          .join(', ');
        return <div>{branches ?? '-'}</div>;
      },
    },
    defaultCell<ClassColumnDef>('description', 'description', t('columns.description.label')),
    {
      ...defaultCell<ClassColumnDef>(`teachers.name`, `teachers.id`, t('columns.teachers.label')),
      cell: ({ row }) => {
        const data = row.original;
        const teachers = data.teachers
          ?.map(({ id }) => id && teacherMapping[id]?.name)
          .filter(Boolean)
          .join(', ');
        return <div>{teachers ?? '-'}</div>;
      },
    },
    defaultCell<ClassColumnDef>('status', 'status', t('columns.status.label')),
  ];

  return res;
};
