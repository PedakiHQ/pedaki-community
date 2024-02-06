import { prisma } from '@pedaki/db';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const dataRouter = router({
  // TODO: add permissions check
  reset: privateProcedure
    .input(z.enum(['student', 'import']).array())
    .mutation(async ({ input }) => {
      await prisma.$transaction(input.map(table => prisma[table].deleteMany()));
    }),
});
