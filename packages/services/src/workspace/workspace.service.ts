import { prisma } from '@pedaki/db';
import type { WorkspaceProperties } from '~/workspace/workspace.model.ts';

const SETTINGS_ID = 1;

class WorkspaceService {
  async getSettings(): Promise<WorkspaceProperties> {
    const settings = await prisma.workspaceSetting.findFirstOrThrow({
      where: {
        id: SETTINGS_ID,
      },
      select: {
        name: true,
        contactEmail: true,
        contactName: true,
        logoUrl: true,
        defaultLanguage: true,
        maintenanceWindow: true,
        currentMaintenanceWindow: true,
      },
    });

    return {
      ...settings,
      defaultLanguage: settings.defaultLanguage as WorkspaceProperties['defaultLanguage'],
    };
  }

  async updateSettings({ settings }: { settings: Partial<WorkspaceProperties> }) {
    await prisma.workspaceSetting.update({
      where: {
        id: SETTINGS_ID,
      },
      data: {
        name: settings.name,
        contactEmail: settings.contactEmail,
        contactName: settings.contactName,
        logoUrl: settings.logoUrl,
        defaultLanguage: settings.defaultLanguage,
        maintenanceWindow: settings.maintenanceWindow,
        currentMaintenanceWindow: settings.currentMaintenanceWindow,
      },
    });
  }
}

const workspaceService = new WorkspaceService();
export { workspaceService };
