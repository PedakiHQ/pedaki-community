import { auth } from '@pedaki/auth/server.ts';
import type { Session } from 'next-auth';

export interface Context {
  session: Session | null;
}

export const createContext = async (): Promise<Context> => {
  const session = await auth();

  return {
    session,
  };
};
