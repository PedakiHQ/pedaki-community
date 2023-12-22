import { prisma } from '@pedaki/db';
import { internalProcedure, privateProcedure, router } from '~api/router/trpc.ts';
import { z } from 'zod';
import { WorkspaceSettingKey as PrismaWorkspaceSettingKey } from '.prisma/client';

type WorkspaceSettingKey = Lowercase<PrismaWorkspaceSettingKey>;

export const workspaceRouter = router({
  getSettings: internalProcedure.query(async () => {
    const settings = await prisma.workspaceSetting.findMany({ select: { value: true, key: true } });
    console.log('getSettings', { settings });
    return settings.reduce(
      (acc, cur) => {
        acc[cur.key.toLowerCase() as WorkspaceSettingKey] = cur.value;
        return acc;
      },
      {} as Record<WorkspaceSettingKey, string>,
    );
  }),
  setSettings: privateProcedure
    .input(
      z.array(
        z.object({
          key: z.custom<WorkspaceSettingKey>(
            value => (value as string).toUpperCase() in PrismaWorkspaceSettingKey,
          ),
          value: z.string(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      const newInput = input.map(({ key, value }) => ({
        key: key.toUpperCase() as PrismaWorkspaceSettingKey,
        value,
      }));
      await prisma.workspaceSetting.deleteMany({
        where: { key: { in: newInput.map(({ key }) => key) } },
      });
      await prisma.workspaceSetting.createMany({ data: newInput, skipDuplicates: true });
    }),
});
