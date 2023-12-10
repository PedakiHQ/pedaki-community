import { authRouter } from '~api/router/routers/auth.ts';
import { helloRouter } from '~api/router/routers/hello.ts';
import { workspaceRouter } from '~api/router/routers/workspace.ts';
import { router } from '~api/router/trpc.ts';

export const appRouter = router({
  workspace: workspaceRouter,
  hello: helloRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
