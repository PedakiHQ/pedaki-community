import { authService } from '@pedaki/services/auth/auth.service.js';
import { InvalidTokenError } from '@pedaki/services/errors/InvalidTokenError.js';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const authRouter = router({
  getUserInfoFromActivationToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .output(z.object({ email: z.string(), name: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;

      return await authService.getAccountFromToken(token, 'ACTIVATE_ACCOUNT');
    }),

  activateAccount: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const { email, password, token } = input;

      // check that the token is valid
      const tokenRecord = await authService.getAccountFromToken(token, 'ACTIVATE_ACCOUNT');
      if (tokenRecord.email !== email) {
        throw new InvalidTokenError();
      }

      await authService.updatePassword(email, password);
      await authService.deleteToken(token, 'ACTIVATE_ACCOUNT');
    }),

  acceptInvite: publicProcedure
    .input(
      z.object({
        token: z.string(),
        name: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      const { email, password, token, name } = input;

      // check that the token is valid
      const tokenRecord = await authService.getAccountFromToken(token, 'ACTIVATE_ACCOUNT');
      if (tokenRecord.email !== email) {
        throw new InvalidTokenError();
      }

      await authService.updatePassword(email, password);
      await authService.updateAccount(email, name);
      await authService.deleteToken(token, 'ACTIVATE_ACCOUNT');
    }),
});
