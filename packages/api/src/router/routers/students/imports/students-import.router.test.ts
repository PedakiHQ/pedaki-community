import { assertIsAuthenticated } from '@pedaki/tests/middleware';
import {
  getAnonymousSession,
  getInternalSession,
  getUserSession,
} from '~api/tests/helpers/sessions.ts';
import { describe, test } from 'vitest';

describe('studentImports', () => {
  const anonymousSession = getAnonymousSession();
  const userSession = getUserSession();
  const internalSession = getInternalSession();

  // TODO: move these tests in a different package to avoid having it included in the production build

  describe('upload', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(
          () =>
            api.students.imports.upload({
              buffer: Buffer.from(''),
              mimeType: 'text/csv',
            }),
          {
            shouldWork: type !== 'anonymousUserSession',
          },
        );
      },
    );
  });

  describe('status', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(
          () =>
            api.students.imports.status({
              id: '123',
            }),
          {
            shouldWork: type !== 'anonymousUserSession',
          },
        );
      },
    );
  });
});
