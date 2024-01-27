import { studentPropertiesService } from '~/students/properties.service.ts';
import { z } from 'zod';

export interface QueryFieldSchema {
  type: z.Schema;
  mappping: string;
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
    mappping: 'COUNT(*)',
    fieldType: 'int',
  },
  id: {
    type: z.number(),
    mappping: 'students.id',
    fieldType: 'int',
  },
  identifier: {
    type: z.string(),
    mappping: 'identifier',
    fieldType: 'text',
  },
  firstName: {
    type: z.string(),
    mappping: 'first_name',
    fieldType: 'text',
  },
  lastName: {
    type: z.string(),
    mappping: 'last_name',
    fieldType: 'text',
  },
  otherName: {
    type: z.string(),
    mappping: 'other_name',
    fieldType: 'text',
  },
  birthDate: {
    type: z.date(),
    mappping: 'birth_date',
    fieldType: 'date',
  },
  'class.academicYearId': {
    type: z.number(),
    mappping: 'class.academic_year_id',
    fieldType: 'int',
  },
  'class.id': {
    type: z.number(),
    mappping: 'class.id',
    fieldType: 'int',
  },
  'class.name': {
    type: z.string(),
    mappping: 'class.name',
    fieldType: 'text',
  },
  'class.levelId': {
    type: z.number(),
    mappping: 'class.level_id',
    fieldType: 'int',
  },
  'class.mainTeacherId': {
    type: z.number(),
    mappping: 'class.main_teacher_id',
    fieldType: 'int',
  },
  'class.teachers.id': {
    type: z.number(),
    mappping: 'teachers.id',
    fieldType: 'int',
  },
  'class.teachers.name': {
    type: z.string(),
    mappping: 'teachers.name',
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
  z
    .custom<`properties.${string}`>(key => {
      return (
        typeof key === 'string' &&
        key.startsWith('properties.') &&
        !key.includes(' ') &&
        !key.includes("'")
      );
    })
    .refine(
      key => {
        const propertyKey = key.split('properties.', 2)[1]!;
        const property = studentPropertiesService.getPropertySchema(propertyKey);
        return property !== null;
      },
      key => ({
        message: `Unknown property ${key}`,
      }),
    ),
]);
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

export const FilterSchema = z
  .object({
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
  })
  .refine(({ field, operator, value }) => {
    const knownField = getKnownField(field);
    let zodSchema: z.Schema | undefined = undefined;
    let fieldType: FieldType | undefined = undefined;
    if (knownField) {
      zodSchema = knownField.type;
      fieldType = knownField.fieldType;
    } else if (field.startsWith('properties.')) {
      const propertyKey = field.split('properties.', 2)[1]!;
      const property = studentPropertiesService.getPropertySchema(propertyKey);
      if (!property) return false;
      zodSchema = property.schema;
      fieldType = property.type;
    }

    if (!fieldType || !zodSchema) return false;

    const isArray = Array.isArray(value);
    if (isArray && !['in', 'nin'].includes(operator)) return false;
    if (!isArray && ['in', 'nin'].includes(operator)) return false;
    if (!isArray) {
      const allowedOperators = FieldAllowedOperators[fieldType];
      if (!allowedOperators.includes(operator)) return false;
    }

    if (isArray) {
      zodSchema.array().parse(value, {
        path: [field, 'value'],
      });
      return true;
    } else {
      zodSchema.parse(value, {
        path: [field, 'value'],
      });
      return true;
    }
  });
export type Filter = z.infer<typeof FilterSchema>;
