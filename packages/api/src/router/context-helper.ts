import type { Session } from 'next-auth';

export const createInnerContext = (session: Session | null, headers: Headers) => {
  return {
    session,
    headers,
  };
};
