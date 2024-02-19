import { default as Algorithm } from '@pedaki/algorithms/generate_classes/algorithm.js';
import { prisma } from '@pedaki/db';
import { ClassGeneratorInputWithRefinementSchema } from '@pedaki/services/classes/generator.model.js';
import { studentQueryService } from '@pedaki/services/students/query.service.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const classGeneratorRouter = router({
  create: privateProcedure
    .input(ClassGeneratorInputWithRefinementSchema)
    .mutation(async ({ input }) => {
      const queryData = studentQueryService.buildSelectPreparedQuery(
        {
          where: input.where,
          fields: ['id', 'gender', 'birthDate'], // TODO: add properties based on the input
          pagination: {
            page: 1,
            limit: -1, // Skip pagination
          },
        },
        {
          selectFields: ['id'],
        },
      );

      const data =
        await prisma.$queryRawUnsafe<
          { id: number; gender: string; birthDate: string; [key: string]: any }[]
        >(queryData);

      // TODO: transform data to match algorithm input

      const students = data.map(student => {
        return {
          id: student.id,
          birthdate: student.birthDate,
          gender: student.gender,
          levels: {},
        };
      });

      const algo = new Algorithm(students, {
        constraints: input.constraints,
        rules: input.rules,
      });
    }),
});
