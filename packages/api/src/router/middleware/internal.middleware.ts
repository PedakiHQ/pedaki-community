import { TRPCError } from '@trpc/server';
import { env } from '~api/env';
import { isLogged } from '~api/router/middleware/session.middleware.ts';

const error = new TRPCError({
  code: 'UNAUTHORIZED',
  message: 'INVALID_TOKEN',
});

const missingSignature = new TRPCError({
  code: 'UNAUTHORIZED',
  message: 'MISSING_SECRET',
});

export const isInternal = isLogged.unstable_pipe(async ({ ctx, next }) => {
  const secret = ctx.headers.get('x-pedaki-secret');
  if (!secret || typeof secret !== 'string') {
    throw missingSignature;
  }

  if (secret !== env.API_INTERNAL_SECRET) {
    throw error;
  }

  return await next();
});
