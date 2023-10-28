import { createContext } from '@pedaki/api/router/context';
import { appRouter } from '@pedaki/api/router/router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

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
