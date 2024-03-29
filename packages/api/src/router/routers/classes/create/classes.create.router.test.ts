import { assertIsAuthenticated } from '@pedaki/tests/middleware';
import {
  getAnonymousSession,
  getInternalSession,
  getUserSession,
} from '~api/tests/helpers/sessions.ts';
import { describe, expect, test } from 'vitest';

describe('classesCreateRouter', () => {
  const anonymousSession = getAnonymousSession();
  const userSession = getUserSession();
  const internalSession = getInternalSession();
  const classesToCreate = [
    {
      name: 'test',
      students: [1, 2, 3],
    },
    {
      name: 'yey',
      students: [1, 2, 3],
    },
  ];

  describe('createMany', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(() => api.classes.create.createMany(classesToCreate), {
          shouldWork: type !== 'anonymousUserSession',
        });
      },
    );

    test.each([userSession, internalSession])('creates classes - $type', async ({ api }) => {
      await api.classes.create.createMany(classesToCreate);
      const classes = await api.classes.getMany();
      expect(Object.values(classes).length).toBeGreaterThanOrEqual(2);
    });
  });
});
