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
        logoUrl: true,
        defaultLanguage: true,
      },
    });

    return {
      name: settings.name,
      logoUrl: settings.logoUrl,
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
        logoUrl: settings.logoUrl,
        defaultLanguage: settings.defaultLanguage,
      },
    });
  }
}

const workspaceService = new WorkspaceService();
export { workspaceService };
