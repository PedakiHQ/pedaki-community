import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from '~/server/router/context.ts';
import { appRouter } from '~/server/router/router.ts';

// Add back once NextAuth v5 is released
// export const runtime = 'edge';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/t',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
