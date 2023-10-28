import { helloRouter } from '~/router/routers/hello';
import { router } from '~/router/trpc';

export const appRouter = router({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
