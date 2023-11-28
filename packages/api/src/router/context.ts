import { auth } from '@pedaki/auth/server.ts';
import type { NextRequest } from 'next/server';

export interface Context {
  session: Awaited<ReturnType<typeof auth>>;
}

export const createContext = async ({}: { req: NextRequest }): Promise<Context> => {
  const session = await auth();

  return {
    session,
  };
};
