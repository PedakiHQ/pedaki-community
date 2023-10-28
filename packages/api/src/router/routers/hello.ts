import { procedure, router } from '~/router/trpc.ts';
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
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
