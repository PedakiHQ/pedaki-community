import { prisma } from '@pedaki/db';
import { GetManyClassBranchesSchema } from '@pedaki/services/classes/branch.model.js';
import type { GetManyClassBranches } from '@pedaki/services/classes/branch.model.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const classBranchesRouter = router({
  getMany: privateProcedure.output(GetManyClassBranchesSchema).query(async () => {
    const data = await prisma.classBranch.findMany({
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
    }, {} as GetManyClassBranches);
  }),
});
