import { prisma } from '@pedaki/db';
import { preparePagination } from '@pedaki/services/shared/utils.js';
import {
  GetManyStudentsInputSchema,
  GetManyStudentsOutputSchema,
} from '@pedaki/services/students/student.model.js';
import { studentService } from '@pedaki/services/students/student.service.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const studentsRouter = router({
  getMany: privateProcedure
    .input(GetManyStudentsInputSchema)
    .output(GetManyStudentsOutputSchema)
    .query(async ({ input }) => {
      // TODO valid operator/value based on schema

      const queryData = studentService.buildPreparedQuery(input, { selectFields: input.fields });
      const queryCount = studentService.buildPreparedQuery(input, {
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
});
