import { z } from 'zod';

export const StudentSchema = z.object({
  id: z.number().min(0),

  identifier: z.string().min(0).max(255).nullable().optional(),

  firstName: z.string().min(0).max(255),
  lastName: z.string().min(0).max(255),
  otherName: z.string().min(0).max(255).nullable().optional(),

  birthDate: z.coerce.date(),

  properties: z.record(z.union([z.string(), z.number()])).optional(),
});
export type Student = z.infer<typeof StudentSchema>;
