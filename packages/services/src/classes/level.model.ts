import { z } from 'zod';

export const ClassLevelSchema = z.object({
  id: z.number().min(0),
  name: z.string().min(0).max(255),
  description: z.string().min(0).max(255).nullable(),
  color: z.string().length(7),
});
export type ClassLevel = z.infer<typeof ClassLevelSchema>;

export const GetManyClassLevelsSchema = z.record(ClassLevelSchema);
export type GetManyClassLevels = z.infer<typeof GetManyClassLevelsSchema>;
