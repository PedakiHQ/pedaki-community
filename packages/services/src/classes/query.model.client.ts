import { createFilterSchema } from '~/utils/query';
import type { FieldType } from '~/utils/query';
import { z } from 'zod';

export interface QueryFieldSchema {
  type: z.Schema;
  fieldType: FieldType;
}

const KnownFields: Record<(typeof KnownFieldsKeys)[number], QueryFieldSchema> = {
  id: {
    type: z.number(),
    fieldType: 'int',
  },
  name: {
    type: z.string(),
    fieldType: 'text',
  },
  description: {
    type: z.string(),
    fieldType: 'text',
  },
  status: {
    type: z.enum([
      'ACTIVE',
      'ARCHIVED',
      'PENDING'
    ]), // TODO: synchro avec ClassStatus dans la db
    fieldType: 'text',
  },
  'academicYear.id': {
    type: z.number(),
    fieldType: 'int',
  },
  'academicYear.name': {
    type: z.number(),
    fieldType: 'text',
  },
  'academicYear.startDate': {
    type: z.number(),
    fieldType: 'date',
  },
  'academicYear.endDate': {
    type: z.number(),
    fieldType: 'date',
  },
  'level.id': {
    type: z.number(),
    fieldType: 'int',
  },
  'level.name': {
    type: z.number(),
    fieldType: 'text',
  },
  'level.description': {
    type: z.number(),
    fieldType: 'text',
  },
  'mainTeacher.id': {
    type: z.number(),
    fieldType: 'int',
  },
  'mainTeacher.name': {
    type: z.number(),
    fieldType: 'text',
  },
  'teachers.id': {
    type: z.number(),
    fieldType: 'int',
  },
  'teachers.name': {
    type: z.string(),
    fieldType: 'text',
  },
  'branches.id': {
    type: z.number(),
    fieldType: 'int',
  },
  'branches.name': {
    type: z.string(),
    fieldType: 'text',
  },
  'branches.description': {
    type: z.string(),
    fieldType: 'text',
  },
} as const;

export const KnownFieldsKeys = [
  'id',
  'name',
  'description',
  'status',
  'academicYear.id',
  'academicYear.name',
  'academicYear.startDate',
  'academicYear.endDate',
  'level.id',
  'level.name',
  'level.description',
  'mainTeacher.id',
  'mainTeacher.name',
  'teachers.id',
  'teachers.name',
  'branches.id',
  'branches.name',
  'branches.description',
] as const;

export const getKnownField = (key: string): QueryFieldSchema | undefined => {
  return KnownFields[key as (typeof KnownFieldsKeys)[number]];
};

export const FieldSchema = z.enum(KnownFieldsKeys);
export type Field = z.infer<typeof FieldSchema>;

export const FilterSchema = createFilterSchema(FieldSchema)
  .refine(({ field, value }) => {
    const knownField = getKnownField(field)
    if(!knownField) return true; // TODO ??
    return knownField.type.safeParse(value).success
});
export type Filter = z.infer<typeof FilterSchema>;
