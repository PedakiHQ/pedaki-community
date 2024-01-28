import { TRPCError } from '@trpc/server';
import type { Context } from '~api/router/context.ts';
import { t } from '~api/router/init.ts';

// infers the `session` as non-nullable
const ctxWithUser = (session: Context['session']) => {
  return {
    ctx: {
      session: {
        ...session,
        user: session!.user,
      },
    },
  };
};

const getInternalSession = (ctx: Context): Context['session'] => {
  const secret = ctx.headers.get('x-pedaki-secret'); // TODO const secret name
  if (!secret) return null;
  return {
    user: {
      image: '',
      name: 'internal',
      email: 'developers@pedaki.fr',
      id: '0',
      emailVerified: true,
    },
    expires: new Date().toString(), // TODO ajouter quelque chose ? quelques minutes jsp
  };
};

export const isLogged = t.middleware(({ ctx, next }) => {
  const internalSession = getInternalSession(ctx);

  if (!internalSession && !ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'AUTHENTICATION_REQUIRED',
    });
  }

  const session = internalSession ?? ctx.session;

  return next(ctxWithUser(session));
});
