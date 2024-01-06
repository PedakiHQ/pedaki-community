/* c8 ignore start */
import { auth } from '@pedaki/auth/server.ts';
import { createInnerContext } from '~api/router/context-helper.ts';
import type { NextRequest } from 'next/server';

export const createContext = async ({}: { req: NextRequest }) => {
  const session = await auth();

  return createInnerContext(session);
};

export type Context = ReturnType<typeof createInnerContext>;
