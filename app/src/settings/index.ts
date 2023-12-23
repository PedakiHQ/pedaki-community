'use server';

import { logger } from '@pedaki/logger';
import { env } from '~/env.ts';
import { api } from '~/server/clients/internal.ts';
import type { OutputType } from '~api/router/router.ts';

export const getWorkspaceSettings = async () => {
  let response: OutputType['workspace']['getSettings'];
  try {
    response = await api.workspace.getSettings.query();
  } catch (error) {
    logger.error('getWorkspaceSettings', error);
    response = {
      name: env.NEXT_PUBLIC_PEDAKI_NAME,
    };
  }

  // set default values
  if (!response.name) response.name = env.NEXT_PUBLIC_PEDAKI_NAME;
  return response;
};
