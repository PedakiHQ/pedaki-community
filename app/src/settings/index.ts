'use server';

import { cache } from '@pedaki/common/cache';
import { logger } from '@pedaki/logger';
import { api } from '~/server/clients/internal.ts';
import { CACHE_KEY } from '~/settings/constants.ts';
import type { OutputType } from '~api/router/router.ts';

export const getWorkspaceSettings = async () => {
  return await cache(async () => {
    let response: OutputType['workspace']['getSettings'];
    try {
      response = await api.workspace.getSettings.query();
    } catch (error) {
      logger.error('getWorkspaceSettings', error);
      response = {
        name: '',
        logoUrl: '',
        defaultLanguage: 'fr',
        contactEmail: '',
        contactName: '',
        currentMaintenanceWindow: '',
        maintenanceWindow: '',
      };
    }

    return response;
  }, CACHE_KEY);
};
