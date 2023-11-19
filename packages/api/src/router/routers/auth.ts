import { authService } from '@pedaki/services/auth/auth.service.js';
import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';

export const authRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await authService.createAccount(input.name, input.email, input.password);
      } catch (e) {
        if ((e as Prisma.PrismaClientKnownRequestError).code === 'P2002') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'ALREADY_EXISTS',
          });
        }
      }
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

  profile: publicProcedure
    .input(z.undefined())
    .output(z.any())
    .query(({ ctx }) => {
      return ctx.session;
    }),
});
