import { env } from '~api/env.ts';
import { publicProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const helloRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(opts => {
      return {
        greeting: `${env.SECRET_PRIVATE_VARIABLE} ${opts.input.text}`,
      };
    }),
});
