import { prisma } from '@pedaki/db';
import {
  MergeGetManyInput,
  MergeGetManyStudentsOutput,
  MergeGetOneInput,
  MergeGetOneStudentOutput,
  MergeUpdateOneStudentInputSchema,
} from '@pedaki/services/students/imports/merge/merge.model';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const studentImportsStudents = router({
  getMany: privateProcedure
    .input(MergeGetManyInput)
    .output(MergeGetManyStudentsOutput)
    .query(async ({ input }) => {
      return await prisma.importStudent.findMany({
        where: {
          importId: input.importId,
        },
        select: {
          id: true,
          status: true,
          firstName: true,
          lastName: true,
          otherName: true,
        },
      });
    }),

  getOne: privateProcedure
    .input(MergeGetOneInput)
    .output(MergeGetOneStudentOutput)
    .query(async ({ input }) => {
      const data = await prisma.importStudent.findUniqueOrThrow({
        where: {
          id: input.id,
          importId: input.importId,
        },
        select: {
          id: true,
          status: true,
          firstName: true,
          lastName: true,
          otherName: true,
          gender: true,
          birthDate: true,
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              otherName: true,
              birthDate: true,
              gender: true,
            },
          },
        },
      });

      const importData = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        otherName: data.otherName,
        gender: data.gender,
        birthDate: data.birthDate,
      };

      return {
        status: data.status,
        import: importData,
        current: data.student,
      };
    }),

  updateOne: privateProcedure
    .input(MergeUpdateOneStudentInputSchema)
    .mutation(async ({ input }) => {
      const status = input.status;
      const data = input.data?.current;
      if (status === 'DONE' && !data) {
        throw new Error('Data is required when status is DONE');
      }
      if (status === 'IGNORED') {
        await prisma.importStudent.update({
          where: {
            id: input.id,
            importId: input.importId,
          },
          data: {
            status: 'IGNORED',
          },
        });
      }
      console.log(input);
    }),

  getPossibleStudentData: privateProcedure
    .input(
      z.object({
        studentId: z.number(),
      }),
    )
    .output(MergeGetOneStudentOutput.pick({ current: true }))
    .query(async ({ input }) => {
      const data = await prisma.student.findUniqueOrThrow({
        where: {
          id: input.studentId,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          otherName: true,
          birthDate: true,
          gender: true,
        },
      });

      return {
        current: data,
      };
    }),
});
