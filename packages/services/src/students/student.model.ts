import { PaginationInputSchema, PaginationOutputSchema } from '~/shared/pagination.model.ts';
import { z } from 'zod';

export const StudentSchema = z.object({
  id: z.number().min(0),

  identifier: z.string().min(0).max(255).nullable().optional(),

  firstName: z.string().min(0).max(255),
  lastName: z.string().min(0).max(255),
  otherName: z.string().min(0).max(255).nullable().optional(),

  birthDate: z.coerce.date(),

  properties: z.record(z.union([z.string(), z.number()])).optional(),
});
export type Student = z.infer<typeof StudentSchema>;

// postgres cast
const KnownFields = {
  count: {
    type: z.number(),
    mappping: 'COUNT(*)',
    cast: 'int',
  },
  id: {
    type: StudentSchema.shape.id,
    mappping: 'students.id',
    cast: 'int',
  },
  identifier: {
    type: StudentSchema.shape.identifier,
    mappping: 'identifier',
    cast: 'text',
  },
  firstName: {
    type: StudentSchema.shape.firstName,
    mappping: 'first_name',
    cast: 'text',
  },
  lastName: {
    type: StudentSchema.shape.lastName,
    mappping: 'last_name',
    cast: 'text',
  },
  otherName: {
    type: StudentSchema.shape.otherName,
    mappping: 'other_name',
    cast: 'text',
  },
  birthDate: {
    type: StudentSchema.shape.birthDate,
    mappping: 'birth_date',
    cast: 'date',
  },
  'class.academicYearId': {
    type: z.number(),
    mappping: 'class.academic_year_id',
    cast: 'int',
  },
  'class.name': {
    type: z.string(),
    mappping: 'class.name',
    cast: 'text',
  },
  'class.levelId': {
    type: z.number(),
    mappping: 'class.level_id',
    cast: 'int',
  },
  'class.mainTeacherId': {
    type: z.number(),
    mappping: 'class.main_teacher_id',
    cast: 'int',
  },
  'class.teachers.id': {
    type: z.number(),
    mappping: 'teachers.id',
    cast: 'int',
  },
  'class.teachers.name': {
    type: z.string(),
    mappping: 'teachers.name',
    cast: 'text',
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

export const getKnownField = (key: string): (typeof KnownFields)[keyof typeof KnownFields] => {
  return KnownFields[key as keyof typeof KnownFields];
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

export const PropertiesSchema = z.object({
  field: FieldSchema,
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'like', 'nlike']),
  value: z.union([
    z.string(),
    z.string().array(),
    z.number(),
    z.number().array(),
    z.boolean(),
    z.date(),
    z.date().array(),
  ]),
});
export type Properties = z.infer<typeof PropertiesSchema>;

//

export const GetManyStudentsInputSchema = z.object({
  fields: FieldSchema.array().min(1),
  filter: z.array(PropertiesSchema).optional(),
  orderBy: z.array(z.tuple([FieldSchema, z.enum(['asc', 'desc'])])).optional(),
  pagination: PaginationInputSchema.optional().default({
    page: 1,
    limit: 10,
  }),
});

export type GetManyStudentsInput = z.infer<typeof GetManyStudentsInputSchema>;

export const GetManyStudentsOutputSchema = z.object({
  data: z.array(StudentSchema.partial().merge(z.object({ class: z.record(z.any()) }))),
  meta: PaginationOutputSchema,
});

export const UpdateOneStudentInputSchema = StudentSchema.partial().merge(
  StudentSchema.pick({ id: true }),
);
export type UpdateOneStudentInput = z.infer<typeof UpdateOneStudentInputSchema>;
