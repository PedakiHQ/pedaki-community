import { assertIsAuthenticated } from '@pedaki/tests/middleware.js';
import {
  getAnonymousSession,
  getInternalSession,
  getUserSession,
} from '~api/tests/helpers/sessions.ts';
import { beforeEach } from 'node:test';
import { beforeAll, describe, expect, test } from 'vitest';

describe('studentsRouter', () => {
  const anonymousSession = getAnonymousSession();
  const userSession = getUserSession();
  const internalSession = getInternalSession();

  describe('getMany', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(
          () =>
            api.students.getMany({
              fields: ['id'],
              filter: [],
            }),
          {
            shouldWork: type !== 'anonymousUserSession',
          },
        );
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - without filter',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['id'],
          filter: [],
          pagination: {
            page: 1,
            limit: 10,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(10);
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with filter',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['id'],
          filter: [
            {
              field: 'firstName',
              operator: 'eq',
              value: 'Nathan',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBeGreaterThanOrEqual(1);
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with many filter',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['firstName', 'properties.math_level'],
          filter: [
            {
              field: 'firstName',
              operator: 'like',
              value: 'Natha',
            },
            {
              field: 'lastName',
              operator: 'in',
              value: ['Dupont', 'Dupond'],
            },
            {
              field: 'otherName',
              operator: 'neq',
              value: 'shrek',
            },
            {
              field: 'birthDate',
              operator: 'gte',
              value: new Date('2001-01-01 00:00:00'),
            },
            {
              field: 'properties.math_level',
              operator: 'eq',
              value: 15,
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(1);
        expect(data[0].firstName).toBe('Nathan');
        expect(data[0].properties.math_level).toBe('15');
      },
    );
  });

  describe('getOne', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(() => api.students.getOne({ id: 1 }), {
          shouldWork: type !== 'anonymousUserSession',
        });
      },
    );

    test.each([userSession, internalSession])('returns a student - $type', async ({ api }) => {
      const student = await api.students.getOne({ id: 1 });

      expect(student).toBeDefined();
      expect(student.id).toBe(1);
    });
  });
});
