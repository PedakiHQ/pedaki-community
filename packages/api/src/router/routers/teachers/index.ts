import { prisma } from '@pedaki/db';
import { GetManyTeachersSchema } from '@pedaki/services/teachers/teachers.model.js';
import type { GetManyTeachers } from '@pedaki/services/teachers/teachers.model.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const teachersRouter = router({
  getMany: privateProcedure.output(GetManyTeachersSchema).query(async () => {
    const data = await prisma.teacher.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return data.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as GetManyTeachers);
  }),
});
