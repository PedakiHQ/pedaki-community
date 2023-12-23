import { prisma } from '@pedaki/db';
import { internalProcedure, privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';
import { WorkspaceSettingKey } from '.prisma/client';

export const workspaceRouter = router({
  getSettings: internalProcedure.query(async () => {
    if (process.env.CI) {
      return {} as Record<WorkspaceSettingKey, string>;
    }
    const settings = await prisma.workspaceSetting.findMany({ select: { value: true, key: true } });
    console.log('getSettings', { settings });
    return settings.reduce(
      (acc, cur) => {
        acc[cur.key] = cur.value;
        return acc;
      },
      {} as Record<WorkspaceSettingKey, string>,
    );
  }),
  setSettings: privateProcedure
    .input(
      z.array(
        z.object({
          key: z.nativeEnum(WorkspaceSettingKey),
          value: z.string(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      await prisma.$transaction(
        input.map(setting => {
          return prisma.workspaceSetting.upsert({
            where: { key: setting.key },
            create: { key: setting.key, value: setting.value },
            update: { value: setting.value },
          });
        }),
      );
    }),
});
