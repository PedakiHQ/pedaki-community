import { prisma } from '@pedaki/db';
import { privateProcedure, router } from '~api/router/trpc.ts';
import type {WorkspaceSettingKey} from '.prisma/client';

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
});
