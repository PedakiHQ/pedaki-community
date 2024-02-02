import { z } from 'zod';

export const GetManyTeachersSchema = z.record(
  z.object({
    id: z.number(),
    name: z.string(),
  }),
);
export type GetManyClasses = z.infer<typeof GetManyTeachersSchema>;
