import { TRPCError } from '@trpc/server';
import type { Context } from '~api/router/context.ts';
import { t } from '~api/router/init.ts';

// infers the `session` as non-nullable
const ctxWithUser = (ctx: Context) => {
  return {
    ctx: {
      session: ctx.session!,
    },
  };
};

export const isLogged = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in',
    });
  }

  return next(ctxWithUser(ctx));
});
