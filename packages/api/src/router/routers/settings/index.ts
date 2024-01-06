import { revalidate } from '@pedaki/common/cache/memory-cache.js';
import { WorkspacePropertiesSchema } from '@pedaki/services/workspace/workspace.model.js';
import { workspaceService } from '@pedaki/services/workspace/workspace.service.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const settingsRouter = router({
  getSettings: privateProcedure.output(WorkspacePropertiesSchema).query(async () => {
    return await workspaceService.getSettings();
  }),

  setSettings: privateProcedure
    .input(WorkspacePropertiesSchema.partial())
    .mutation(async ({ input }) => {
      revalidate('workspaceSettingsRouter.getSettings'); // TODO: not a good idea to use memory-cache here + not using the constant
      await workspaceService.updateSettings({ settings: input });
    }),
});
