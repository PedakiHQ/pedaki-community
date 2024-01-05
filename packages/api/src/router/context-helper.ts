import type { Session } from 'next-auth';

export const createInnerContext = (session: Session | null) => {
  return {
    session,
  };
};
