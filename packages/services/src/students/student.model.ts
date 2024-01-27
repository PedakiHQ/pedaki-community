import { PaginationInputSchema, PaginationOutputSchema } from '~/shared/pagination.model.ts';
import { StudentSchema } from '~/students/student_base.model.ts';
import { z } from 'zod';
import { FieldSchema, FilterSchema } from './query.model.ts';

export const GetManyStudentsInputSchema = z.object({
  fields: FieldSchema.array(),
  where: FilterSchema.array().optional(),
  orderBy: z.array(z.tuple([FieldSchema, z.enum(['asc', 'desc'])])).optional(),
  pagination: PaginationInputSchema.optional().default({
    page: 1,
    limit: 10,
  }),
});

export type GetManyStudentsInput = z.infer<typeof GetManyStudentsInputSchema>;

export const GetManyStudentsOutputSchema = z.object({
  data: z.array(
    StudentSchema.partial()
      .merge(
        z.object({
          class: z
            .object({
              id: z.number(),
              teachers: z.array(
                z.object({
                  id: z.number(),
                }),
              ),
            })
            .partial()
            .passthrough(),
        }),
      )
      .merge(StudentSchema.pick({ id: true })),
  ),
  meta: PaginationOutputSchema,
});
export type GetManyStudentsOutput = z.infer<typeof GetManyStudentsOutputSchema>;

export const UpdateOneStudentInputSchema = StudentSchema.partial().merge(
  StudentSchema.pick({ id: true }),
);
export type UpdateOneStudentInput = z.infer<typeof UpdateOneStudentInputSchema>;

export const GetStudentMappingSchema = z.array(
  z.object({
    type: z.enum(['property', 'class', 'teacher', 'default']),
    field: z.string(),
  }),
);
export type GetStudentMapping = z.infer<typeof GetStudentMappingSchema>;

export * from '~/students/student_base.model.ts';
