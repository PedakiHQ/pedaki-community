import { initTRPC } from '@trpc/server';
import { env } from '~api/env';
import type { Context } from '~api/router/context';
import superjson from 'superjson';

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ error, shape }) {
    if (error.code === 'INTERNAL_SERVER_ERROR' && env.NODE_ENV === 'production') {
      return { ...shape, message: 'Internal server error' };
    }
    console.log(error);
    // TODO: add logging here
    // And prevent sending error to client in production
    return shape;
  },
});