import { PaginationInputSchema, PaginationOutputSchema } from '~/shared/pagination.model.ts';
import { z } from 'zod';
import { FieldSchema, PropertiesSchema } from './query.model.ts';

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
