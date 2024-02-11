import { prisma } from '@pedaki/db';
import { GetManyClassLevelsSchema } from '@pedaki/services/classes/level.model.js';
import type { GetManyClassLevels } from '@pedaki/services/classes/level.model.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const classLevelsRouter = router({
  getMany: privateProcedure.output(GetManyClassLevelsSchema).query(async () => {
    const data = await prisma.classLevel.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
      },
    });

    return data.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as GetManyClassLevels);
  }),
});
