import { z } from 'zod';

export interface QueryFieldSchema {
  type: z.Schema;
  fieldType: FieldType;
}

const FieldTypes = ['int', 'text', 'date'] as const;
export type FieldType = (typeof FieldTypes)[number];

export const FieldAllowedOperators: Record<FieldType, QueryOperator[]> = {
  int: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
  text: ['eq', 'neq', 'like', 'nlike'],
  date: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
} as const;

export const isPositiveOperator = (operator: QueryOperator): boolean => {
  return ['eq', 'gt', 'gte', 'in', 'like'].includes(operator);
};

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

const QueryOperators = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  // 'in',
  // 'nin',
  'like',
  'nlike',
] as const;
export const QueryOperatorSchema = z.enum(QueryOperators);
export type QueryOperator = z.infer<typeof QueryOperatorSchema>;

export const FilterSchema = z.object({
  field: FieldSchema,
  operator: QueryOperatorSchema,
  value: z.union([
    z.string(),
    // z.string().array(),
    z.number(),
    // z.number().array(),
    z.boolean(),
    z.date(),
    // z.date().array(),
  ]),
});
export type Filter = z.infer<typeof FilterSchema>;
