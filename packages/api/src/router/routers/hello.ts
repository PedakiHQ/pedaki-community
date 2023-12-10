import { env } from '~api/env.ts';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const helloRouter = router({
  hello: privateProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return {
        greeting: `${env.SECRET_PRIVATE_VARIABLE} ${input.text} ${ctx.session.user.name}`,
      };
    }),
});
