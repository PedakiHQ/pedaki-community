import { assertIsAuthenticated } from '@pedaki/tests/middleware.js';
import {
  getAnonymousSession,
  getInternalSession,
  getUserSession,
} from '~api/tests/helpers/sessions.ts';
import { describe, expect, test } from 'vitest';

describe('classesBranchesRouter', () => {
  const anonymousSession = getAnonymousSession();
  const userSession = getUserSession();
  const internalSession = getInternalSession();

  describe('getMany', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(() => api.classes.branches.getMany(), {
          shouldWork: type !== 'anonymousUserSession',
        });
      },
    );
    test.each([userSession, internalSession])('returns at least one result', async ({ api }) => {
      const data = await api.classes.branches.getMany();
      expect(Object.values(data).length).toBeGreaterThan(0);
    });
  });
});
