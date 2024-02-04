import { prisma } from '@pedaki/db';
import {
  GetAllClassesSchema,
  GetManyClassesInputSchema,
  GetManyClassesOutputSchema,
} from '@pedaki/services/classes/class.model.js';
import type { GetAllClasses } from '@pedaki/services/classes/class.model.js';
import type { Prisma } from '@prisma/client';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { filtersArrayToPrismaWhere, orderByArrayToPrismaOrderBy } from '~api/router/utils';

export const classesRouter = router({
  getMany: privateProcedure.output(GetAllClassesSchema).query(async () => {
    const data = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return data.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as GetAllClasses);
  }),

  getPaginatedMany: privateProcedure
    .input(GetManyClassesInputSchema)
    .output(GetManyClassesOutputSchema)
    .query(async ({ input }) => {
      const fields = input.fields.reduce(
        (acc, curr) => {
          acc[curr] = true;
          return acc;
        },
        {} as Record<(typeof input.fields)[number], boolean>,
      );

      const [data, meta] = await prisma.class
        .paginate({
          select: {
            id: fields.id,
            name: fields.name,
            description: fields.description,
            academicYear:
              input.fields.filter(field => field.startsWith('academicYear.')).length <= 0
                ? undefined
                : {
                    select: {
                      id: fields['academicYear.id'],
                      name: fields['academicYear.name'],
                      startDate: fields['academicYear.startDate'],
                      endDate: fields['academicYear.endDate'],
                    },
                  },
            level:
              input.fields.filter(field => field.startsWith('level.')).length <= 0
                ? undefined
                : {
                    select: {
                      id: fields['level.id'],
                      name: fields['level.name'],
                      description: fields['level.description'],
                    },
                  },
            teachers:
              input.fields.filter(field => field.startsWith('teachers.')).length <= 0
                ? undefined
                : {
                    select: {
                      id: fields['teachers.id'],
                      name: fields['teachers.name'],
                    },
                  },
            mainTeacher:
              input.fields.filter(field => field.startsWith('mainTeacher.')).length <= 0
                ? undefined
                : {
                    select: {
                      id: fields['mainTeacher.id'],
                      name: fields['mainTeacher.name'],
                    },
                  },
            branches:
              input.fields.filter(field => field.startsWith('branches.')).length <= 0
                ? undefined
                : {
                    select: {
                      id: fields['branches.id'],
                      name: fields['branches.name'],
                      description: fields['branches.description'],
                    },
                  },
          },
          where: filtersArrayToPrismaWhere<Prisma.ClassWhereInput>(input.where),
          orderBy: orderByArrayToPrismaOrderBy<Prisma.ClassOrderByWithRelationInput>(input.orderBy),
        })
        .withPages({
          limit: input.pagination.limit,
          page: input.pagination.page,
        });

      return { data, meta };
    }),
});
