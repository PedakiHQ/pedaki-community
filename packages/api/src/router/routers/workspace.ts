import { prisma } from '@pedaki/db';
import { privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';
import { WorkspaceSettingKey } from '.prisma/client';

export const workspaceRouter = router({
  getSettings: privateProcedure.query(async () => {
    const settings = await prisma.workspaceSetting.findMany({ select: { value: true, key: true } });
    console.log(settings);
    return settings.reduce(
      (acc, cur) => {
        acc[cur.key] = cur.value;
        return acc;
      },
      {} as Record<WorkspaceSettingKey, string>,
    );
  }),
  setSetting: privateProcedure
    .input(
      z.object({
        key: z.nativeEnum(WorkspaceSettingKey),
        value: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await prisma.workspaceSetting.upsert({
        where: { key: input.key },
        update: { value: input.value },
        create: { key: input.key, value: input.value },
      });
    }),
});
