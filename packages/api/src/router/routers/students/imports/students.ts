import { prisma } from '@pedaki/db';
import {
  MergeGetManyInput,
  MergeGetManyStudentsOutput,
  MergeGetOneInput,
  MergeGetOneStudentOutput,
  MergeUpdateOneStudentInputSchema,
  StudentOutputSchema,
} from '@pedaki/services/students/imports/merge/merge.model';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const studentImportsStudents = router({
  getMany: privateProcedure
    .input(MergeGetManyInput)
    .output(MergeGetManyStudentsOutput)
    .query(async ({ input }) => {
      return await prisma.importStudent.findMany({
        orderBy: {
          id: 'asc',
        },
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
          studentId: true,
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

      if (status === 'REMOVED') {
        await prisma.importStudent.update({
          where: {
            id: input.id,
            importId: input.importId,
          },
          data: {
            status: status,
          },
        });
      }

      if (status === 'DONE') {
        const data = input.data?.current;
        const studentId = input.data?.studentId;
        if (!data) {
          throw new Error('Data is required when status is DONE');
        }

        await prisma.importStudent.update({
          where: {
            id: input.id,
            importId: input.importId,
          },
          data: {
            status: 'DONE',
            firstName: data?.firstName,
            lastName: data?.lastName,
            otherName: data?.otherName,
            birthDate: data?.birthDate,
            gender: data.gender,
            studentId: studentId,
          },
        });
      }
    }),

  getPossibleStudentData: privateProcedure
    .input(
      z.object({
        studentId: z.number(),
      }),
    )
    .output(StudentOutputSchema)
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

      return data;
    }),
});
