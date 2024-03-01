import { assertIsAuthenticated } from '@pedaki/tests/middleware';
import {
  getAnonymousSession,
  getInternalSession,
  getUserSession,
} from '~api/tests/helpers/sessions.ts';
import {describe, expect, test} from 'vitest';

describe('classesCreateRouter', () => {
  const anonymousSession = getAnonymousSession();
  const userSession = getUserSession();
  const internalSession = getInternalSession();

  describe('createMany', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(
          () => api.classes.create.createMany([{ name: 'test', description: 'oui' }]),
          {
            shouldWork: type !== 'anonymousUserSession',
          },
        );
      },
    );

    test.each([userSession, internalSession])('creates classes - $type', async ({ api }) => {
      await api.classes.create.createMany([
        {
          name: 'test',
          description: 'oui',
          academicYear: { id: 1 },
          level: { id: 1 },
          branches: [{ id: 1 }],
          students: [1, 2, 3],
        },
        {
          name: 'yey',
          description: 'non',
          academicYear: { id: 1 },
          level: { id: 1 },
          branches: [{ id: 1 }],
          students: [1, 2, 3],
        },
      ]);
      const classes = await api.classes.getMany();
      expect(classes).to()
    });
  });
});
