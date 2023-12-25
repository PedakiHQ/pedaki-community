import { WorkspacePropertiesSchema } from '@pedaki/services/workspace/workspace.model.js';
import { workspaceService } from '@pedaki/services/workspace/workspace.service.js';
import { internalProcedure, privateProcedure, router } from '~api/router/trpc.ts';

export const workspaceRouter = router({
  getSettings: internalProcedure.output(WorkspacePropertiesSchema).query(async () => {
    return await workspaceService.getSettings();
  }),

  setSettings: privateProcedure.input(WorkspacePropertiesSchema).mutation(async ({ input }) => {
    await workspaceService.updateSettings({ settings: input });
  }),
});
