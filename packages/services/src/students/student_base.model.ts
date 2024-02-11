import { z } from 'zod';

export const StudentSchema = z.object({
  id: z.number().min(0),

  identifier: z.string().min(0).max(255).nullable().optional(),

  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  otherName: z.string().min(1).max(255).nullable().optional(),

  gender: z.string().length(1).nullable(),

  birthDate: z.coerce.date().min(new Date(1900, 0, 1)),

  properties: z.record(z.union([z.string(), z.number(), z.null()])).optional(),
});
export type Student = z.infer<typeof StudentSchema>;
