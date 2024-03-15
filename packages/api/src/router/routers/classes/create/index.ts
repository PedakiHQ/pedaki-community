import { prisma } from '@pedaki/db';
import { ClassesCreateInputSchema } from '@pedaki/services/classes/create.model';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const classesCreateRouter = router({
  createMany: privateProcedure.input(ClassesCreateInputSchema).mutation(async ({ input }) => {
    await prisma.$transaction(
      input.map(c =>
        prisma.class.create({
          select: { id: true },
          data: {
            ...c,
            status: 'PENDING',
            students: {
              connect: c.students.map(id => ({ id: id })),
            },
          },
        }),
      ),
    );
  }),
});
