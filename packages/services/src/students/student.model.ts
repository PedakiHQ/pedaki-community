import { PaginationInputSchema, PaginationOutputSchema } from '~/shared/pagination.model.ts';
import { StudentSchema } from '~/students/student_base.model.ts';
import { z } from 'zod';
import { FieldSchema, PropertiesSchema } from './query.model.ts';

export const GetManyStudentsInputSchema = z.object({
  fields: FieldSchema.array(),
  filter: PropertiesSchema.array().optional(),
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

export * from '~/students/student_base.model.ts';
