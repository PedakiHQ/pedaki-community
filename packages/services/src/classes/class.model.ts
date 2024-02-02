import { z } from 'zod';

export const GetManyClassesSchema = z.record(
  z.object({
    id: z.number(),
    name: z.string(),
  }),
);
export type GetManyClasses = z.infer<typeof GetManyClassesSchema>;
