import type { inferRouterOutputs } from '@trpc/server';
import { authRouter } from '~api/router/routers/auth/index.ts';
import { fileRouter } from '~api/router/routers/file/index.ts';
import { settingsRouter } from '~api/router/routers/settings/index.ts';
import { router } from '~api/router/trpc.ts';

export const appRouter = router({
  settings: settingsRouter,
  file: fileRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
export type OutputType = inferRouterOutputs<AppRouter>;
