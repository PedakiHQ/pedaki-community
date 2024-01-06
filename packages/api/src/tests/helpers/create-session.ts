import { createInnerContext } from '~api/router/context-helper.ts';
import { t } from '~api/router/init';
import { appRouter } from '~api/router/router.ts';
import type { Session } from 'next-auth';

let createCaller: ReturnType<typeof t.createCallerFactory<typeof appRouter>> | null = null;

const EMPTY_HEADERS = new Headers();

export const createCallerSession = (
  session: Session | null,
  headers: Headers | null = null,
): ReturnType<typeof appRouter.createCaller> => {
  if (!createCaller) createCaller = t.createCallerFactory(appRouter);
  const ctx = createInnerContext(session, headers ?? EMPTY_HEADERS);
  return createCaller(ctx);
};
export type Caller = ReturnType<typeof createCallerSession>;
