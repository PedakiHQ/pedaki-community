import { prisma } from '@pedaki/db';
import type { GetManyLevels } from '@pedaki/services/classes/class.model.js';
import { GetManyLevelsSchema } from '@pedaki/services/classes/class.model.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const classLevelsRouter = router({
  getMany: privateProcedure.output(GetManyLevelsSchema).query(async () => {
    const data = await prisma.classLevel.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return data.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as GetManyLevels);
  }),
});
