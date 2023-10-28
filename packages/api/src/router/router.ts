import { helloRouter } from '~api/router/routers/hello';
import { router } from '~api/router/trpc';

export const appRouter = router({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
