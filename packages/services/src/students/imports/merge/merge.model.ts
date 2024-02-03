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

export const MergeGetManyStudentsOutput = z.array(
  z.object({
    id: z.number(),
    status: MergeStatus,
    firstName: z.string(),
    lastName: z.string(),
    otherName: z.string().nullable(),
  }),
);

export const MergeGetOneInput = z.object({
  importId: z.string(),
  id: z.number(),
});

export const MergeGetOneClassOutput = z.object({
  status: MergeStatus,
  import: z.object({
    name: z.string(), // class name
    level: z.object({
      name: z.string(),
    }),
  }),
  current: z
    .object({
      name: z.string(),
      levelId: z.number(),
      // academicYearId: z.number(),
      // mainTeacherId: z.number(),
    })
    .nullable(),
});

export const MergeGetOneStudentOutput = z.object({
  status: MergeStatus,
  import: z.object({
    firstName: z.string(),
    lastName: z.string(),
    otherName: z.string().nullable(),
  }),
  current: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      otherName: z.string().nullable(),
    })
    .nullable(),
});
