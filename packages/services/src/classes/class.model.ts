import { z } from 'zod';

export const GetManyClassesSchema = z.record(
  z.object({
    id: z.number(),
    name: z.string(),
    levelId: z.number(),
  }),
);
export type GetManyClasses = z.infer<typeof GetManyClassesSchema>;

export const GetManyLevelsSchema = z.record(
  z.object({
    id: z.number(),
    name: z.string(),
  }),
);
export type GetManyLevels = z.infer<typeof GetManyLevelsSchema>;
