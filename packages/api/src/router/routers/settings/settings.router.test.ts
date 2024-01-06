/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
      console.log(settings);
      expect(settings).toMatchObject({
        name: expect.any(String),
        defaultLanguage: expect.stringMatching(/en|fr/),
        // contactEmail: expect([null, expect.any(String)]),
        // contactName: expect.any(String),
        // currentMaintenanceWindow: expect.any(String),
        // maintenanceWindow: expect.any(String),
      });
    });
  });
});
