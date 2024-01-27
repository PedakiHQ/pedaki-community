import { prisma } from '@pedaki/db';
import { GetManyClassesSchema } from '@pedaki/services/classes/class.model.js';
import type { GetManyClasses } from '@pedaki/services/classes/class.model.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const classesRouter = router({
  getMany: privateProcedure.output(GetManyClassesSchema).query(async () => {
    const data = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return data.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as GetManyClasses);
  }),
});
