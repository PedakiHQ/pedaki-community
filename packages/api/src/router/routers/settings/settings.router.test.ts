import { assertIsAuthenticated } from '@pedaki/tests/middleware.js';
import {
  getAnonymousSession,
  getInternalSession,
  getUserSession,
} from '~api/tests/helpers/sessions.ts';
import { describe, expect, test } from 'vitest';

describe('settingsRouter', () => {
  const anonymousSession = getAnonymousSession();
  const userSession = getUserSession();
  const internalSession = getInternalSession();

  describe('getSettings', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(api.settings.getSettings, {
          shouldWork: type !== 'anonymousUserSession',
        });
      },
    );

    test('returns the settings', async () => {
      const { api } = internalSession;
      const settings = await api.settings.getSettings();
      expect(Object.keys(settings)).toEqual([
        'name',
        'defaultLanguage',
        'contactEmail',
        'contactName',
        'currentMaintenanceWindow',
        'maintenanceWindow',
      ]);
    });
  });

  describe('setSettings', () => {
    test.skip.each([anonymousSession, userSession])(
      'need permission to use this route - $type',
      async () => {
        // TODO
      },
    );

    test('updates the settings', async () => {
      const { api } = internalSession;
      const newSettings = { name: 'new name' };
      await api.settings.setSettings(newSettings);
      const updatedSettings = await api.settings.getSettings();
      expect(updatedSettings.name).toBe(newSettings.name);
    });
  });
});
