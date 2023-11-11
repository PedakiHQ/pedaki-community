import { authRouter } from '~api/router/routers/auth.ts';
import { helloRouter } from '~api/router/routers/hello';
import { router } from '~api/router/trpc';

export const appRouter = router({
  hello: helloRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
