import { z } from 'zod';

export const ClassBranchSchema = z.object({
  id: z.number().min(0),
  name: z.string().min(0).max(255),
  description: z.string().min(0).max(1000).nullable(),
  color: z.string().length(7),
});
export type ClassBranch = z.infer<typeof ClassBranchSchema>;

export const GetManyClassBranchesSchema = z.record(ClassBranchSchema);
export type GetManyClassBranches = z.infer<typeof GetManyClassBranchesSchema>;
