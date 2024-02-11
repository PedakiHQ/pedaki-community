import { prisma } from '@pedaki/db';
import {
  GetManyClassesSchema,
  GetPaginatedManyClassesInputSchema,
  GetPaginatedManyClassesOutputSchema,
} from '@pedaki/services/classes/class.model.js';
import type { GetManyClasses } from '@pedaki/services/classes/class.model.js';
import type { Prisma } from '@prisma/client';
import { classBranchesRouter } from '~api/router/routers/classes/branches';
import { classLevelsRouter } from '~api/router/routers/classes/levels';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { filtersArrayToPrismaWhere, orderByArrayToPrismaOrderBy } from '~api/router/utils';

export const classesRouter = router({
  branches: classBranchesRouter,
  levels: classLevelsRouter,

  getMany: privateProcedure.output(GetManyClassesSchema).query(async () => {
    const data = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        levelId: true,
      },
    });

    return data.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as GetManyClasses);
  }),

  getPaginatedMany: privateProcedure
    .input(GetPaginatedManyClassesInputSchema)
    .output(GetPaginatedManyClassesOutputSchema)
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
                    orderBy: orderByArrayToPrismaOrderBy<Prisma.ClassOrderByWithRelationInput>(
                      input.orderBy,
                      { stepDown: 'branches' },
                    ),
                  },
            teachers:
              input.fields.filter(field => field.startsWith('teachers.')).length <= 0
                ? undefined
                : {
                    select: {
                      id: fields['teachers.id'],
                      name: fields['teachers.name'],
                    },
                    orderBy: orderByArrayToPrismaOrderBy<Prisma.ClassOrderByWithRelationInput>(
                      input.orderBy,
                      { stepDown: 'teachers' },
                    ),
                  },
          },
          where: filtersArrayToPrismaWhere<Prisma.ClassWhereInput>(input.where),
          orderBy: orderByArrayToPrismaOrderBy<Prisma.ClassOrderByWithRelationInput>(
            input.orderBy,
            { ignoreStartsWith: ['branches', 'teachers'] },
          ),
        })
        .withPages({
          limit: input.pagination.limit,
          page: input.pagination.page,
        });

      return { data, meta };
    }),
});
