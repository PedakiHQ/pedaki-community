import type { Session } from 'next-auth';
import '@pedaki/auth/next-auth.d.ts';

export const createInnerContext = (session: Session | null, headers: Headers) => {
  return {
    session,
    headers,
  };
};
