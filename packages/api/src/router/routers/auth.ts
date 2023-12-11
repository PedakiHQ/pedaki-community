import { prisma } from '@pedaki/db';
import { authService } from '@pedaki/services/auth/auth.service.js';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const authRouter = router({
  isFirstUser: publicProcedure
    .input(z.any())
    .output(z.boolean())
    .query(async () => {
      const userCount = await prisma.user.count({
        where: {
          active: true,
        },
      });

      return userCount === 0;
    }),

  getUserInfoFromActivationToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .output(z.object({ email: z.string(), name: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;

      try {
        return await authService.getAccountFromToken(token, 'ACTIVATE_ACCOUNT');
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'INVALID_TOKEN',
        });
      }
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
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'INVALID_TOKEN',
        });
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
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'INVALID_TOKEN',
        });
      }

      await authService.updatePassword(email, password);
      await authService.updateAccount(email, name);
      await authService.deleteToken(token, 'ACTIVATE_ACCOUNT');
    }),
});
