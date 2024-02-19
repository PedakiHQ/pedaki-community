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
          fields: ['id'],
          pagination: {
            page: 1,
            limit: -1, // Skip pagination
          },
        },
        {
          selectFields: ['id'],
        },
      );

      const data = await prisma.$queryRawUnsafe<{ id: number; [key: string]: any }[]>(queryData);

      // TODO: transform data to match algorithm input

      // const algo = new Algorithm();
    }),
});
