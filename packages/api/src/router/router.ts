import type { inferRouterOutputs } from '@trpc/server';
import { academicYearsRouter } from '~api/router/routers/academic-year';
import { authRouter } from '~api/router/routers/auth/index.ts';
import { classesRouter } from '~api/router/routers/classes';
import { dataRouter } from '~api/router/routers/data';
import { fileRouter } from '~api/router/routers/file/index.ts';
import { settingsRouter } from '~api/router/routers/settings/index.ts';
import { studentsRouter } from '~api/router/routers/students/index.ts';
import { teachersRouter } from '~api/router/routers/teachers';
import { router } from '~api/router/trpc.ts';

export const appRouter = router({
  settings: settingsRouter,
  students: studentsRouter,
  classes: classesRouter,
  academicYear: academicYearsRouter,
  teachers: teachersRouter,
  files: fileRouter,
  auth: authRouter,
  data: dataRouter,
});

export type AppRouter = typeof appRouter;
export type OutputType = inferRouterOutputs<AppRouter>;
