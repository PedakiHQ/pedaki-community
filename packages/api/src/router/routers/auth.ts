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

  //
  // debug_delete_account: publicProcedure
  //     .input(UserModelSchema.pick({ id: true }))
  //     .output(z.any())
  //     .mutation(async ({ input }) => {
  //         try {
  //             await prisma.user.delete({
  //                 where: {
  //                     id: input.id,
  //                 },
  //             });
  //         } catch (e) {
  //             // If the user doesn't exist, we don't care
  //         }
  //     }),
  //
  // debug_send_validation_email: privateProcedure.mutation(({ ctx }) => {
  //     return confirmEmailFlow(prisma, {
  //         id: ctx.session.id,
  //         name: ctx.session.name,
  //         email: 'nathan.d0601@gmail.com', //ctx.session.email
  //     });
  // }),
  //
  // confirmEmail: publicProcedure
  //     .input(
  //         z.object({
  //             token: z.string(),
  //         }),
  //     )
  //     .mutation(async ({ input }) => {
  //         const { token } = input;
  //
  //         const tokenRecord = await getTokenOrThrow(prisma, token, true);
  //
  //         if (tokenRecord.userId === null) {
  //             throw new TRPCError({
  //                 code: 'BAD_REQUEST',
  //                 message: 'INVALID_TOKEN',
  //             });
  //         }
  //
  //         // If everything is ok, update the user
  //         await prisma.user.update({
  //             where: {
  //                 id: tokenRecord.userId,
  //             },
  //             data: {
  //                 emailVerified: new Date(),
  //             },
  //         });
  //     }),
});
