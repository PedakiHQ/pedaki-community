import { PaginationInputSchema, PaginationOutputSchema } from '~/shared/pagination.model.ts';
import { TeacherSchema } from '~/teachers/teachers.model.ts';
import { z } from 'zod';
import { FieldSchema, FilterSchema } from './query.model.ts';

export const AcademicYearSchema = z.object({
  id: z.number().min(0),
  name: z.string().min(0).max(255),
  startDate: z.date(),
  endDate: z.date(),
});
export type AcademicYear = z.infer<typeof AcademicYearSchema>;

export const ClassLevelSchema = z.object({
  id: z.number().min(0),
  name: z.string().min(0).max(255),
  description: z.string().min(0).max(255).nullable(),
  color: z.string().length(7),
});
export type ClassLevel = z.infer<typeof ClassLevelSchema>;

export const ClassBranchSchema = z.object({
  id: z.number().min(0),
  name: z.string().min(0).max(255),
  description: z.string().min(0).max(1000).nullable(),
  color: z.string().length(7),
});
export type ClassBranch = z.infer<typeof ClassBranchSchema>;

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

export const GetAllClassesSchema = z.record(ClassesSchema.pick({ id: true, name: true }));
export type GetAllClasses = z.infer<typeof GetAllClassesSchema>;

export const GetManyClassesInputSchema = z.object({
  fields: FieldSchema.array().min(1),
  // where: FilterSchema.array().optional(),
  where: z.any().optional(),
  orderBy: z.array(z.tuple([FieldSchema, z.enum(['asc', 'desc'])])).optional(),
  pagination: PaginationInputSchema.optional().default({
    page: 1,
    limit: 10,
  }),
});
export type GetManyClassesInput = z.infer<typeof GetManyClassesInputSchema>;

export const GetManyClassesOutputSchema = z.object({
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
          // studentsCount: z.number(),
        }),
      )
      .partial(),
  ),
  meta: PaginationOutputSchema,
});
export type GetManyClassesOutput = z.infer<typeof GetManyClassesOutputSchema>;
