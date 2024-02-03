import { ImportDataStatus } from '@prisma/client';
import { z } from 'zod';

export const MergeGetManyInput = z.object({
  importId: z.string(),
});

export const MergeStatus = z.nativeEnum(ImportDataStatus);

export const MergeGetManyClassesOutput = z.array(
  z.object({
    id: z.number(),
    status: MergeStatus,
    name: z.string(),
  }),
);
