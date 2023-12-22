import { authRouter } from '~api/router/routers/auth.ts';
import { helloRouter } from '~api/router/routers/hello.ts';
import { workspaceRouter } from '~api/router/routers/workspace.ts';
import { router } from '~api/router/trpc.ts';
import type {inferRouterOutputs} from '@trpc/server';

export const appRouter = router({
  workspace: workspaceRouter,
  hello: helloRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
export type OutputType = inferRouterOutputs<AppRouter>
