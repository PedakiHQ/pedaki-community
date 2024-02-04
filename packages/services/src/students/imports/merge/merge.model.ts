import { ImportDataStatus } from '@prisma/client';
import { StudentSchema } from '~/students/student_base.model.ts';
import { z } from 'zod';

export const MergeGetManyInput = z.object({
  importId: z.string(),
});

export const MergeStatus = z.nativeEnum(ImportDataStatus);

export const MergeGetManyDataSchema = z.object({
  id: z.number(),
  status: MergeStatus,
});
export const MergeGetManyClassesOutput = z.array(
  MergeGetManyDataSchema.merge(
    z.object({
      name: z.string(),
    }),
  ),
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
  import: StudentSchema.pick({
    id: true,
    firstName: true,
    lastName: true,
    otherName: true,
    gender: true,
    birthDate: true,
  }),
  current: StudentSchema.pick({
    id: true,
    firstName: true,
    lastName: true,
    otherName: true,
    gender: true,
    birthDate: true,
  }).nullable(),
});

export const MergeUpdateOneStudentInputSchema = z
  .object({
    status: MergeStatus,
    data: MergeGetOneStudentOutput.pick({ current: true }).optional(),
  })
  .merge(MergeGetOneInput);
export type MergeUpdateOneStudentInput = z.infer<typeof MergeUpdateOneStudentInputSchema>;
