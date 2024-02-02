import { z } from 'zod';

export const TeacherSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type Teacher = z.infer<typeof TeacherSchema>;

export const GetManyTeachersSchema = z.record(TeacherSchema);
export type GetManyTeachers = z.infer<typeof GetManyTeachersSchema>;
