import { PaginationInputSchema, PaginationOutputSchema } from '~/shared/pagination.model.ts';
import { StudentSchema } from '~/students/student_base.model.ts';
import { TeacherSchema } from '~/teachers/teachers.model.ts';
import { z } from 'zod';
import { FieldSchemaWithRefinement, FilterSchemaWithRefinement } from './query.model.ts';

export const GetManyStudentsInputSchema = z.object({
  fields: FieldSchemaWithRefinement.array(),
  where: FilterSchemaWithRefinement.array().optional(),
  orderBy: z.array(z.tuple([FieldSchemaWithRefinement, z.enum(['asc', 'desc'])])).optional(),
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
              teachers: z.array(TeacherSchema.pick({ id: true }).partial().passthrough()),
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

export const GetManyStudentsByIdInputSchema = z.object({
  where: z.number().array(),
});
export type GetManyStudentsByIdInput = z.infer<typeof GetManyStudentsByIdInputSchema>;

export const GetManyStudentsByIdOutputSchema = z.array(StudentSchema);
export type GetManyStudentsByIdOutput = z.infer<typeof GetManyStudentsByIdOutputSchema>;

export * from '~/students/student_base.model.ts';
