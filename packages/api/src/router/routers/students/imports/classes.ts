import {prisma} from '@pedaki/db';
import {
  MergeGetManyClassesOutput,
  MergeGetManyInput,
  MergeGetOneClassOutput,
  MergeGetOneInput,
} from '@pedaki/services/students/imports/merge/merge.model';
import {privateProcedure, router} from '~api/router/trpc.ts';
import {z} from 'zod';

export const studentImportsClasses = router({
  getMany: privateProcedure
    .input(MergeGetManyInput)
    .output(MergeGetManyClassesOutput)
    .query(async ({ input }) => {
      return await prisma.importClass.findMany({
        where: {
          importId: input.importId,
        },
        select: {
          id: true,
          name: true,
          status: true,
        },
      });
    }),

  getOne: privateProcedure
    .input(MergeGetOneInput)
    .output(MergeGetOneClassOutput)
    .query(async ({ input }) => {
      const data = await prisma.importClass.findUniqueOrThrow({
        where: {
          id: input.id,
          importId: input.importId,
        },
        select: {
          id: true,
          name: true,
          status: true,
          importLevel: {
            select: {
              name: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              levelId: true,
              academicYearId: true,
              mainTeacherId: true,
            },
          },
        },
      });

      const importData = {
        name: data.name,
        level: {
          name: data.importLevel.name,
        },
      };

      return {
        status: data.status,
        import: importData,
        current: data.class,
      };
    }),

  getPossibleClassData: privateProcedure
    .input(
      z.object({
        classId: z.number(),
      }),
    )
    .output(MergeGetOneClassOutput.pick({ current: true }))
    .query(async ({ input }) => {
      const data = await prisma.class.findUniqueOrThrow({
        where: {
          id: input.classId,
        },
        select: {
          id: true,
          name: true,
          levelId: true,
          academicYearId: true,
          mainTeacherId: true,
        },
      });

      return {
        current: data
      };
    }),
});
