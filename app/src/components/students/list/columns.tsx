'use client';

import type { Field } from '@pedaki/services/students/query.model.client';
import type { GetManyStudentsOutput } from '@pedaki/services/students/student.model.js';
import { defaultCell, levelCell } from '~/components/datatable/columns';
import type { ColumnDef } from '~/components/datatable/columns';
import type { UseScopedI18nType } from '~/locales/client.ts';
import type { OutputType } from '~api/router/router.ts';

export type StudentData = GetManyStudentsOutput['data'][number];
export type StudentColumnDef = ColumnDef<StudentData, Field>;

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
    defaultCell<StudentColumnDef>('firstName', 'firstName', t('columns.firstName.label')),
    defaultCell<StudentColumnDef>('lastName', 'lastName', t('columns.lastName.label')),
    defaultCell<StudentColumnDef>('gender', 'gender', t('columns.gender.label')),
    {
      ...defaultCell<StudentColumnDef>('class.name', `class.id`, t('columns.class.label')),
      cell: ({ row }) => {
        const data = row.original;
        const value = data.class && classMapping[data.class.id!]?.name;
        const hasValue = value != null;
        return <div className={hasValue ? '' : 'text-soft'}>{hasValue ? value : '-'}</div>;
      },
    },
    {
      ...defaultCell<StudentColumnDef>(
        `class.teachers.name`,
        `class.teachers.id`,
        t('columns.teachers.label'),
      ),
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
      res.push(levelCell<StudentColumnDef>(`properties.${key}`, value.name));
    } else {
      res.push(defaultCell<StudentColumnDef>(`properties.${key}`, `properties.${key}`, value.name));
    }
  });

  return res;
};
