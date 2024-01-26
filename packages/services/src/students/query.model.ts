import { StudentSchema } from '~/students/student.model.ts';
import { z } from 'zod';

export interface QueryFieldSchema {
  type: z.Schema;
  mappping: string;
  fieldType: FieldType;
}

const FieldTypes = ['int', 'text', 'date'] as const;
export type FieldType = (typeof FieldTypes)[number];

export const FieldAllowedOperators: Record<FieldType, QueryOperator[]> = {
  int: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin'],
  text: ['eq', 'neq', 'like', 'nlike'],
  date: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin'],
} as const;

const KnownFields: Record<string, QueryFieldSchema> = {
  count: {
    type: z.number(),
    mappping: 'COUNT(*)',
    fieldType: 'int',
  },
  id: {
    type: StudentSchema.shape.id,
    mappping: 'students.id',
    fieldType: 'int',
  },
  identifier: {
    type: StudentSchema.shape.identifier,
    mappping: 'identifier',
    fieldType: 'text',
  },
  firstName: {
    type: StudentSchema.shape.firstName,
    mappping: 'first_name',
    fieldType: 'text',
  },
  lastName: {
    type: StudentSchema.shape.lastName,
    mappping: 'last_name',
    fieldType: 'text',
  },
  otherName: {
    type: StudentSchema.shape.otherName,
    mappping: 'other_name',
    fieldType: 'text',
  },
  birthDate: {
    type: StudentSchema.shape.birthDate,
    mappping: 'birth_date',
    fieldType: 'date',
  },
  'class.academicYearId': {
    type: z.number(),
    mappping: 'class.academic_year_id',
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

const KnownFieldsKeys = [
  'count',
  'id',
  'identifier',
  'firstName',
  'lastName',
  'otherName',
  'birthDate',
  'class.academicYearId',
  'class.name',
  'class.levelId',
  'class.mainTeacherId',
  'class.teachers.id',
  'class.teachers.name',
] as const;

export const getKnownField = (key: string): QueryFieldSchema | undefined => {
  return KnownFields[key];
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

const QueryOperators = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'nin',
  'like',
  'nlike',
] as const;
export const QueryOperatorSchema = z.enum(QueryOperators);
export type QueryOperator = z.infer<typeof QueryOperatorSchema>;

export const PropertiesSchema = z
  .object({
    field: FieldSchema,
    operator: QueryOperatorSchema,
    value: z.union([
      z.string(),
      z.string().array(),
      z.number(),
      z.number().array(),
      z.boolean(),
      z.date(),
      z.date().array(),
    ]),
  })
  .refine(
    ({ field, operator, value }) => {
      const knownField = getKnownField(field);
      if (!knownField) return false;

      const allowedOperators = FieldAllowedOperators[knownField.fieldType];
      if (!allowedOperators.includes(operator)) return false;

      const type = knownField.type;
      return type.safeParse(value).success;
    },
    {
      message: 'Invalid property',
    },
  );
export type Properties = z.infer<typeof PropertiesSchema>;
