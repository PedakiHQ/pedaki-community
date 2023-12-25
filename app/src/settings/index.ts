'use server';

import { logger } from '@pedaki/logger';
import { api } from '~/server/clients/internal.ts';
import type { OutputType } from '~api/router/router.ts';

export const getWorkspaceSettings = async () => {
  let response: OutputType['workspace']['getSettings'];
  try {
    response = await api.workspace.getSettings.query();
  } catch (error) {
    logger.error('getWorkspaceSettings', error);
    response = {
      name: '',
      logoUrl: '',
      defaultLanguage: 'fr',
    };
  }

  return response;
};
