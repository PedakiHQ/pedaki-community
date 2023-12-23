'use server';

import { env } from '~/env.ts';
import { api } from '~/server/clients/internal.ts';

export const getWorkspaceSettings = async () => {
  const response = await api.workspace.getSettings.query();

  // set default values
  if (!response.name) response.name = env.NEXT_PUBLIC_PEDAKI_DOMAIN;
  return response;
};
