import { prisma } from '@pedaki/db';
import {
  GetAllClassesSchema,
  GetManyClassesInputSchema,
  GetManyClassesOutputSchema,
} from '@pedaki/services/classes/class.model.js';
import type { GetAllClasses, GetManyClassesInput } from '@pedaki/services/classes/class.model.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

// TODO: move to a separate file
const filtersArrayToPrismaWhere = <T extends object>(
  filters: GetManyClassesInput['where'] | undefined,
): T => {
  const where = {} as T;
  if (filters) {
    for (const { field, operator, value } of filters) {
      const fieldParts = field.split('.');
      let current = where;
      // Move to the last part of the field
      for (const part of fieldParts) {
        // Initialize the next part of the where object and move to it
        // @ts-expect-error: need to fix the T type
        current = current[part] = current[part] || {};
      }

      // If we are in a negatiive operator, we need to create a not object
      switch (operator) {
        case 'neq':
        case 'nlike':
          // Initialize the next part of the where object and move to it
          // @ts-expect-error: need to fix the T type
          current = current.not = current.not || {};
          break;
      }
      switch (operator) {
        case 'eq':
        case 'neq':
          // @ts-expect-error: need to fix the T type
          current.equals = value;
          break;
        case 'like':
        case 'nlike':
          // @ts-expect-error: need to fix the T type
          current.contains = value;
          break;
        // case 'gt':
        // case 'gte':
        // case 'lt':
        // case 'lte':
        default:
          // @ts-expect-error: need to fix the T type
          current[operator] = value;
      }
    }
  }

  return where;
};

// TODO: move to a separate file
const orderByArrayToPrismaOrderBy = <T extends object>(
  orderBy: GetManyClassesInput['orderBy'] | undefined,
): T => {
  const orderByResult = {} as T;
  if (orderBy) {
    for (const [field, sort] of orderBy) {
      const fieldParts = field.split('.');
      if (fieldParts.length > 0) {
        let current = orderByResult;
        // Move to the last part of the field
        for (const part of fieldParts.slice(0, -1)) {
          // Initialize the next part of the where object and move to it
          // @ts-expect-error: need to fix the T type
          current = current[part] = current[part] || {};
        }
        // @ts-expect-error: need to fix the T type
        current[fieldParts[fieldParts.length - 1]] = sort;
      }
    }
  }

  return orderByResult;
};

export const classesRouter = router({
  getAll: privateProcedure.output(GetAllClassesSchema).query(async () => {
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

  getMany: privateProcedure
    .input(GetManyClassesInputSchema)
    .output(GetManyClassesOutputSchema)
    .query(async ({ input }) => {
      // TODO orderBy
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
          // TODO: fix type, I can't access Prisma.ClassWhereInput
          // where: filtersArrayToPrismaWhere<Prisma.ClassWhereInput>(input.where),
          where: filtersArrayToPrismaWhere<any>(input.where),
          // TODO: not working with args like academicYear.id
          // TODO: fix type, I can't access Prisma.ClassOrderByWithRelationInput
          // orderBy: orderByArrayToPrismaOrderBy<Prisma.ClassOrderByWithRelationInput>(input.orderBy),
          orderBy: orderByArrayToPrismaOrderBy<any>(input.orderBy),
        })
        .withPages({
          limit: input.pagination.limit,
          page: input.pagination.page,
        });

      return { data, meta };
    }),
});
