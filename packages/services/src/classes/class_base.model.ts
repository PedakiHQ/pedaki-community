import { z } from 'zod';

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
  description: z.string().min(0).max(255).optional(),
  color: z.string().length(7),
});
export type ClassLevel = z.infer<typeof ClassLevelSchema>;

// export const ClassBranchSchema = z.object({
//   id: z.number().min(0),
//   name: z.string().min(0).max(255),
//   description: z.string().min(0).max(1000).optional(),
//   color: z.string().length(7),
// });
// export type ClassBranch = z.infer<typeof ClassBranchSchema>;

export const ClassesSchema = z.object({
  id: z.number().min(0),
  name: z.string().min(0).max(255),
  description: z.string().min(0).max(1000).optional(),
  academicYear: AcademicYearSchema,
  level: ClassLevelSchema,
  // branches: z.array(ClassBranchSchema),
  // TODO teacher schema
  mainTeacher: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .optional(),
});
export type Class = z.infer<typeof ClassesSchema>;
