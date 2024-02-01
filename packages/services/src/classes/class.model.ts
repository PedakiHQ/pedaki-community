import { ClassesSchema } from '~/classes/class_base.model.ts';
import { PaginationInputSchema, PaginationOutputSchema } from '~/shared/pagination.model.ts';
import { z } from 'zod';
import { FieldSchema, FilterSchema } from './query.model.ts';

export const GetManyClassesSchema = z.record(ClassesSchema.pick({ id: true, name: true }));
export type GetManyClasses = z.infer<typeof GetManyClassesSchema>;

export const PaginateClassesInputSchema = z.object({
  fields: FieldSchema.array(),
  where: FilterSchema.array().optional(),
  orderBy: z.array(z.tuple([FieldSchema, z.enum(['asc', 'desc'])])).optional(),
  pagination: PaginationInputSchema.optional().default({
    page: 1,
    limit: 10,
  }),
});
export type PaginateClassesInput = z.infer<typeof PaginateClassesInputSchema>;

export const PaginateClassesOutputSchema = z.object({
  data: z.array(
    ClassesSchema.partial()
      .merge(ClassesSchema.pick({ id: true, name: true }))
      .merge(
        z.object({
          teachers: z.array(
            z
              .object({
                id: z.number().optional(),
              })
              .passthrough(),
          ),
          studentsCount: z.number().optional(),
        }),
      ),
  ),
  meta: PaginationOutputSchema,
});
export type PaginateClassesOutput = z.infer<typeof PaginateClassesOutputSchema>;

export * from '~/classes/class_base.model.ts';
