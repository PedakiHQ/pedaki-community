import { z } from 'zod';

export const AcademicYearSchema = z.object({
  id: z.number().min(0),
  name: z.string().min(0).max(255),
  startDate: z.date(),
  endDate: z.date(),
});
export type AcademicYear = z.infer<typeof AcademicYearSchema>;

export const GetManyAcademicYearsSchema = z.record(AcademicYearSchema);
export type GetManyAcademicYears = z.infer<typeof GetManyAcademicYearsSchema>;
