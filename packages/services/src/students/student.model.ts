import { PaginationInputSchema, PaginationOutputSchema } from '~/shared/pagination.model.ts';
import { z } from 'zod';

export const StudentSchema = z.object({
  id: z.number().min(0),

  identifier: z.string().min(0).max(255).nullable(),

  firstName: z.string().min(0).max(255),
  lastName: z.string().min(0).max(255),
  otherName: z.string().min(0).max(255).nullable(),

  birthDate: z.coerce.date(),

  properties: z.record(z.union([z.string(), z.number()])).optional(),
});

const KnownPropertiesMapping = [
  'id',
  'identifier',
  'first_name',
  'last_name',
  'other_name',
  'birth_date',
] as const;
const KnownProperties = [
  'id',
  'identifier',
  'firstName',
  'lastName',
  'otherName',
  'birthDate',
] as const;
type KnownProperty = (typeof KnownProperties)[number];

export const KnownPropertyFromDb = KnownPropertiesMapping.reduce(
  (acc, k, i) => ({
    ...acc,
    [k]: KnownProperties[i],
  }),
  {} as Record<(typeof KnownPropertiesMapping)[number], KnownProperty>,
);
export const KnownPropertyToDb = KnownProperties.reduce(
  (acc, k, i) => ({
    ...acc,
    [k]: KnownPropertiesMapping[i],
  }),
  {} as Record<KnownProperty, (typeof KnownPropertiesMapping)[number]>,
);

export const isKnownProperty = (property: unknown): property is KnownProperty => {
  return KnownProperties.includes(property as KnownProperty);
};

export const FieldSchema = z.union([
  z.enum(KnownProperties),
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

export const GetManyStudentsInputSchema = z.object({
  fields: FieldSchema.array().min(1),
  filter: z.array(PropertiesSchema),
  pagination: PaginationInputSchema.optional().default({
    page: 1,
    limit: 10,
  }),
});

export type GetManyStudentsInput = z.infer<typeof GetManyStudentsInputSchema>;

export const GetManyStudentsOutputSchema = z.object({
  data: z.array(StudentSchema.partial()),
  meta: PaginationOutputSchema,
});

export const UpdateOneStudentInputSchema = z.object({
  where: z.object({
    id: z.number(),
  }),
  data: StudentSchema.partial(),
});
