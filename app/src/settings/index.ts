'use server';

import { api } from '~/server/clients/server.ts';

export const getWorkspaceSettings = () => {
  return api.workspace.getSettings.query();
};
