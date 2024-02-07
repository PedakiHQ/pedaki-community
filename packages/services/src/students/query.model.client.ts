import { createFilterSchema } from '~/utils/query';
import type { FieldType } from '~/utils/query';
import { z } from 'zod';

export interface QueryFieldSchema {
  type: z.Schema;
  mapping: string;
  fieldType: FieldType;
}

const KnownFields: Record<(typeof KnownFieldsKeys)[number], QueryFieldSchema> = {
  count: {
    type: z.number(),
    mapping: 'COUNT(*)',
    fieldType: 'int',
  },
  id: {
    type: z.number(),
    mapping: 'students.id',
    fieldType: 'int',
  },
  identifier: {
    type: z.string(),
    mapping: 'identifier',
    fieldType: 'text',
  },
  firstName: {
    type: z.string(),
    mapping: 'first_name',
    fieldType: 'text',
  },
  lastName: {
    type: z.string(),
    mapping: 'last_name',
    fieldType: 'text',
  },
  otherName: {
    type: z.string(),
    mapping: 'other_name',
    fieldType: 'text',
  },
  birthDate: {
    type: z.date(),
    mapping: 'birth_date',
    fieldType: 'date',
  },
  'class.academicYearId': {
    type: z.number(),
    mapping: 'class.academic_year_id',
    fieldType: 'int',
  },
  'class.id': {
    type: z.number(),
    mapping: 'class.id',
    fieldType: 'int',
  },
  'class.name': {
    type: z.string(),
    mapping: 'class.name',
    fieldType: 'text',
  },
  'class.levelId': {
    type: z.number(),
    mapping: 'class.level_id',
    fieldType: 'int',
  },
  'class.mainTeacherId': {
    type: z.number(),
    mapping: 'class.main_teacher_id',
    fieldType: 'int',
  },
  'class.teachers.id': {
    type: z.number(),
    mapping: 'teachers.id',
    fieldType: 'int',
  },
  'class.teachers.name': {
    type: z.string(),
    mapping: 'teachers.name',
    fieldType: 'text',
  },
} as const;

export const KnownFieldsKeys = [
  'count',
  'id',
  'identifier',
  'firstName',
  'lastName',
  'otherName',
  'birthDate',
  'class.academicYearId',
  'class.id',
  'class.name',
  'class.levelId',
  'class.mainTeacherId',
  'class.teachers.id',
  'class.teachers.name',
] as const;

export const getKnownField = (key: string): QueryFieldSchema | undefined => {
  return KnownFields[key as (typeof KnownFieldsKeys)[number]];
};

export const FieldSchema = z.union([
  z.enum(KnownFieldsKeys),
  z.custom<`properties.${string}`>(key => {
    return (
      typeof key === 'string' &&
      key.startsWith('properties.') &&
      !key.includes(' ') &&
      !key.includes("'")
    );
  }),
]);
export type Field = z.infer<typeof FieldSchema>;

export const FilterSchema = createFilterSchema(FieldSchema);
export type Filter = z.infer<typeof FilterSchema>;
