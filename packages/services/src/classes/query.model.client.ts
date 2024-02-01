import { z } from 'zod';

export interface QueryFieldSchema {
  type: z.Schema;
  mapping: string;
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
  count: {
    type: z.number(),
    mapping: 'COUNT(*)',
    fieldType: 'int',
  },
  id: {
    type: z.number(),
    mapping: 'classes.id',
    fieldType: 'int',
  },
  name: {
    type: z.string(),
    mapping: 'name',
    fieldType: 'text',
  },
  description: {
    type: z.string(),
    mapping: 'description',
    fieldType: 'text',
  },
  'academicYear.id': {
    type: z.number(),
    mapping: 'academic_year_id',
    fieldType: 'int',
  },
  'academicYear.name': {
    type: z.number(),
    mapping: 'academic_years.name',
    fieldType: 'text',
  },
  'academicYear.startDate': {
    type: z.number(),
    mapping: 'academic_years.start_date',
    fieldType: 'date',
  },
  'academicYear.endDate': {
    type: z.number(),
    mapping: 'academic_years.end_date',
    fieldType: 'date',
  },
  'level.id': {
    type: z.number(),
    mapping: 'level_id',
    fieldType: 'int',
  },
  'level.name': {
    type: z.number(),
    mapping: 'class_levels.name',
    fieldType: 'text',
  },
  'level.description': {
    type: z.number(),
    mapping: 'class_levels.description',
    fieldType: 'text',
  },
  'mainTeacher.id': {
    type: z.number(),
    mapping: 'main_teacher_id',
    fieldType: 'int',
  },
  // 'mainTeacher.name': {
  //   type: z.number(),
  //   // TODO: idk mapping
  //   mapping: 'main_teacher.name',
  //   fieldType: 'text',
  // },
  'teachers.id': {
    type: z.number(),
    mapping: 'teachers.id',
    fieldType: 'int',
  },
  'teachers.name': {
    type: z.string(),
    mapping: 'teachers.name',
    fieldType: 'text',
  },
} as const;

export const KnownFieldsKeys = [
  'count',
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
  // 'mainTeacher.name',
  'teachers.id',
  'teachers.name',
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
