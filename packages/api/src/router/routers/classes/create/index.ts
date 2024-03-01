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
            level: {
              connect: {
                id: c.level.id,
              },
            },
            students: {
              connect: c.students.map(id => ({ id: id })),
            },
            academicYear: {
              connect: { id: c.academicYear.id },
            },
            branches: {
              connect: c.branches.map(branch => ({ id: branch.id })),
            },
          },
        }),
      ),
    );
    // await prisma.class.createMany({data: input.map(c => ({
    //     ...c,
    //     levelId: c.level.id,
    //     academicYearId: c.academicYear.id,
    //   }))})
  }),
});
