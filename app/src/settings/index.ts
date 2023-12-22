'use server';

import { api } from '~/server/clients/internal.ts';

export const getWorkspaceSettings = () => {
  return api.workspace.getSettings.query();
};
