'use server';

import { cache } from '@pedaki/common/cache';
import { logger } from '@pedaki/logger';
import { fallbackLocale } from '~/locales/shared.ts';
import { api } from '~/server/clients/internal.ts';
import { CACHE_KEY } from '~/settings/constants.ts';
import type { OutputType } from '~api/router/router.ts';

export const getWorkspaceSettings = async () => {
  return await cache(async () => {
    let response: OutputType['settings']['getSettings'];
    try {
      response = await api.settings.getSettings.query();
    } catch (error) {
      logger.error('getWorkspaceSettings', error);
      response = {
        name: '',
        defaultLanguage: fallbackLocale,
        contactEmail: '',
        contactName: '',
        currentMaintenanceWindow: '',
        maintenanceWindow: '',
      };
    }

    return response;
  }, CACHE_KEY);
};
