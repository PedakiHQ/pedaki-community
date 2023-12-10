import { auth } from '@pedaki/auth/server.ts';
import type { Session } from 'next-auth';
import type { NextRequest } from 'next/server';

export interface Context {
  session: Session | null;
}

export const createContext = async ({}: { req: NextRequest }): Promise<Context> => {
  const session = await auth();

  return {
    session,
  };
};
