import { prisma } from '@pedaki/db';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const dataRouter = router({
  // TODO: add permissions check
  reset: privateProcedure
    .input(z.enum(['student', 'import', 'class', 'property']).array())
    .mutation(async ({ input }) => {
      for (const type of input) {
        switch (type) {
          case 'property':
            await prisma.property.deleteMany({});
            break;
          case 'student':
            await prisma.student.deleteMany({});
            break;
          case 'class':
            await prisma.class.deleteMany({});
            break;
          case 'import':
            await prisma.import.deleteMany({});
            break;
        }
      }
    }),
});
