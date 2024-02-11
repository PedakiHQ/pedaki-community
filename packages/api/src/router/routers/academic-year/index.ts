import { prisma } from '@pedaki/db';
import { GetManyAcademicYearsSchema } from '@pedaki/services/academic-year/academic-year.model.js';
import type { GetManyAcademicYears } from '@pedaki/services/academic-year/academic-year.model.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const academicYearsRouter = router({
  getMany: privateProcedure.output(GetManyAcademicYearsSchema).query(async () => {
    const data = await prisma.academicYear.findMany({
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
      },
    });

    return data.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as GetManyAcademicYears);
  }),
});
