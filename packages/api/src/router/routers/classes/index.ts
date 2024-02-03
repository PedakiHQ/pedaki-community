import { prisma } from '@pedaki/db';
import { GetManyClassesSchema } from '@pedaki/services/classes/class.model.js';
import type { GetManyClasses } from '@pedaki/services/classes/class.model.js';
import { classLevelsRouter } from '~api/router/routers/classes/levels.ts';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const classesRouter = router({
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
});
