import { prisma } from '@pedaki/db';
import { preparePagination } from '@pedaki/services/shared/utils.js';
import {
  GetManyStudentsInputSchema,
  GetManyStudentsOutputSchema,
  StudentSchema,
  UpdateOneStudentInputSchema,
} from '@pedaki/services/students/student.model.js';
import { studentService } from '@pedaki/services/students/student.service.js';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const studentsRouter = router({
  getMany: privateProcedure
    .input(GetManyStudentsInputSchema)
    .output(GetManyStudentsOutputSchema)
    .query(async ({ input }) => {
      // TODO valid operator/value based on schema

      const queryData = studentService.buildSelectPreparedQuery(input, {
        selectFields: input.fields,
      });
      const queryCount = studentService.buildSelectPreparedQuery(input, {
        withPagination: false,
        selectFields: ['COUNT(*) AS count'],
      });

      const [data, meta] = await Promise.all([
        prisma.$queryRawUnsafe<Record<string, any>[]>(queryData),
        prisma.$queryRawUnsafe<{ count: BigInt }[]>(queryCount),
      ]);
      const pagination = preparePagination(
        Number(meta[0]!.count),
        input.pagination.page,
        input.pagination.limit,
      );

      const finalData = data.map(student => {
        const data = Object.entries(student);
        // properties starts with properties.
        const properties = data.filter(([key]) => key.startsWith('properties.'));
        const otherData = data.filter(([key]) => !key.startsWith('properties.'));
        return {
          ...Object.fromEntries(otherData),
          properties: Object.fromEntries(
            properties.map(([key, value]) => [key.split('properties.')[1], value]),
          ) as Record<string, any>,
        };
      });

      return {
        data: finalData,
        meta: pagination,
      };
    }),

  getOne: privateProcedure
    .input(StudentSchema.pick({ id: true }))
    .output(StudentSchema)
    .query(async ({ input }) => {
      const student = await prisma.student.findUnique({
        where: { id: input.id },
      });

      if (!student) {
        // TODO custom error
        throw new Error('Student not found');
      }

      return student;
    }),

  createOne: privateProcedure
    .input(StudentSchema.omit({ id: true }))
    .output(StudentSchema)
    .mutation(async ({ input }) => {
      const student = await prisma.student.create({
        data: {
          ...input,
          properties: input.properties ?? {},
        },
      });

      return student;
    }),

  updateOne: privateProcedure
    .input(UpdateOneStudentInputSchema)
    .output(z.boolean())
    .mutation(async ({ input }) => {
      const updateStudentQuery = studentService.buildUpdatePreparedQuery(input);
      console.log(updateStudentQuery);

      await prisma.$queryRawUnsafe<Record<string, any>[]>(updateStudentQuery);

      return true;
    }),
});
