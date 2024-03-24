import { createInnerContext } from '~api/router/context-helper.ts';
import { createCaller } from '~api/router/router.ts';
import type { Session } from 'next-auth';

const EMPTY_HEADERS = new Headers();

export const createCallerSession = (
  session: Session | null,
  headers: Headers | null = null,
): ReturnType<typeof createCaller> => {
  const ctx = createInnerContext(session, headers ?? EMPTY_HEADERS);
  return createCaller(ctx);
};
export type Caller = ReturnType<typeof createCallerSession>;
