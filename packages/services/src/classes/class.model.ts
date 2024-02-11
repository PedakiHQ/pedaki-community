import { AcademicYearSchema } from '~/academic-year/academic-year.model.ts';
import { ClassBranchSchema } from '~/classes/branch.model.ts';
import { ClassLevelSchema } from '~/classes/level.model.ts';
import { PaginationInputSchema, PaginationOutputSchema } from '~/shared/pagination.model.ts';
import { TeacherSchema } from '~/teachers/teachers.model.ts';
import { z } from 'zod';
import { FieldSchema, FilterSchema } from './query.model.ts';

export const ClassesSchema = z.object({
  id: z.number().min(0),
  name: z.string().min(0).max(255),
  description: z.string().min(0).max(1000).nullable(),
  academicYear: AcademicYearSchema,
  level: ClassLevelSchema,
  branches: z.array(ClassBranchSchema),
  mainTeacher: TeacherSchema.nullable().optional(),
});
export type Class = z.infer<typeof ClassesSchema>;

export const GetManyClassesSchema = z.record(
  ClassesSchema.pick({ id: true, name: true }).merge(z.object({ levelId: z.number() })),
);
export type GetManyClasses = z.infer<typeof GetManyClassesSchema>;

export const GetPaginatedManyClassesInputSchema = z.object({
  fields: FieldSchema.array().min(1),
  where: FilterSchema.array().optional(),
  orderBy: z.array(z.tuple([FieldSchema, z.enum(['asc', 'desc'])])).optional(),
  pagination: PaginationInputSchema.optional().default({
    page: 1,
    limit: 10,
  }),
});
export type GetPaginatedManyClassesInput = z.infer<typeof GetPaginatedManyClassesInputSchema>;

export const GetPaginatedManyClassesOutputSchema = z.object({
  data: z.array(
    ClassesSchema.pick({ id: true, name: true, description: true, mainTeacher: true })
      .merge(
        z.object({
          mainTeacher: TeacherSchema.pick({ id: true, name: true }).partial().nullable(),
          branches: z.array(
            ClassBranchSchema.pick({ id: true, name: true, description: true }).partial(),
          ),
          academicYear: AcademicYearSchema.pick({
            id: true,
            name: true,
            stardDate: true,
            endDate: true,
          }).partial(),
          level: ClassLevelSchema.pick({ id: true, name: true, description: true }).partial(),
          teachers: z.array(TeacherSchema.pick({ id: true, name: true }).partial()),
        }),
      )
      .partial(),
  ),
  meta: PaginationOutputSchema,
});
export type GetPaginatedManyClassesOutput = z.infer<typeof GetPaginatedManyClassesOutputSchema>;
