import { prisma } from '@pedaki/db';
import {
  MergeGetManyClassesOutput,
  MergeGetManyInput,
} from '@pedaki/services/students/imports/merge/merge.model';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const studentImportsClasses = router({
  getMany: privateProcedure
    .input(MergeGetManyInput)
    .output(MergeGetManyClassesOutput)
    .query(async ({ input }) => {
      const classes = await prisma.importClass.findMany({
        where: {
          importId: input.importId,
        },
        select: {
          id: true,
          name: true,
          status: true,
        },
      });

      return classes;
    }),
});
