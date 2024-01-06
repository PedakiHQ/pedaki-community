import { assertIsInternal } from '@pedaki/tests/middleware.js';
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

  describe('getLocale', () => {
    test.each([anonymousSession, userSession])(
      'only internal session can use this route - $type',
      async ({ api, type }) => {
        await assertIsInternal(api.settings.getLocale, type === 'userSession');
      },
    );

    test('returns the locale', async () => {
      const { api } = internalSession;
      const locale = await api.settings.getLocale();
      expect(locale.defaultLanguage).toMatch(/en|fr/);
    });
  });

  describe('getSettings', () => {
    test.each([anonymousSession, userSession])(
      'only internal session can use this route - $type',
      async ({ api, type }) => {
        await assertIsInternal(api.settings.getSettings, type === 'userSession');
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
});
