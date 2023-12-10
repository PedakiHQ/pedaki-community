import { createContext } from '@pedaki/api/router/context';
import { appRouter } from '@pedaki/api/router/router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // default but we want to be explicit

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/t',
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
  });

export { handler as GET, handler as POST };
