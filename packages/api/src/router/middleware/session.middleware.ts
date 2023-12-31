import { TRPCError } from '@trpc/server';
import type { Context } from '~api/router/context.ts';
import { t } from '~api/router/init.ts';

// infers the `session` as non-nullable
const ctxWithUser = (ctx: Context) => {
  return {
    ctx: {
      session: {
        ...ctx.session,
        user: ctx.session!.user,
      },
    },
  };
};

export const isLogged = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'AUTHENTICATION_REQUIRED',
    });
  }

  return next(ctxWithUser(ctx));
});
