import { env } from '~api/env.ts';
import { procedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const helloRouter = router({
  hello: procedure
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
