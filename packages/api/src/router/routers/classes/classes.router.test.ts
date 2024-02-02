import { assertTrpcError, assertZodError } from '@pedaki/tests/error';
import { assertIsAuthenticated } from '@pedaki/tests/middleware.js';
import {
  getAnonymousSession,
  getInternalSession,
  getUserSession,
} from '~api/tests/helpers/sessions.ts';
import { describe, expect, test } from 'vitest';

describe('classesRouter', () => {
  const anonymousSession = getAnonymousSession();
  const userSession = getUserSession();
  const internalSession = getInternalSession();

  describe('getAll', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(() => api.classes.getAll(), {
          shouldWork: type !== 'anonymousUserSession',
        });
      },
    );

    test.each([userSession, internalSession])('returns at least one result', async ({ api }) => {
      const data = await api.classes.getAll();

      expect(Object.values(data).length).toBeGreaterThan(0);
    });
  });

  describe('getMany', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(
          () =>
            api.classes.getMany({
              fields: ['id'],
            }),
          {
            shouldWork: type !== 'anonymousUserSession',
          },
        );
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - without filter - $type',
      async ({ api }) => {
        const { data, meta } = await api.classes.getMany({
          fields: ['id'],
          pagination: {
            page: 1,
            limit: 3,
          },
        });

        console.log(JSON.stringify(data));

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(3);
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with filter - $type',
      async ({ api }) => {
        const { data, meta } = await api.classes.getMany({
          fields: ['id', 'name'],
          where: {
            name: {
              equals: '6ème A',
            },
          },
          pagination: {
            page: 1,
            limit: 10,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(1);
        expect(data[0]!.name).toBe('6ème A');
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with many filter - $type',
      async ({ api }) => {
        const { data, meta } = await api.classes.getMany({
          fields: ['id', 'name'],
          where: {
            AND: {
              description: {
                equals: 'Class A',
              },
              level: {
                id: {
                  equals: 2,
                },
              },
            },
          },
          pagination: {
            page: 1,
            limit: 10,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(1);
        expect(data[0]!.name).toBe('5ème A');
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with join field on one level - $type',
      async ({ api }) => {
        const { data, meta } = await api.classes.getMany({
          fields: ['id', 'name', 'academicYear.id', 'academicYear.name'],
          where: {
            id: {
              equals: 1,
            },
          },
          pagination: {
            page: 1,
            limit: 10,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(1);
        expect(data[0]!.name).toBe('6ème A');
        expect(data[0]!.academicYear!.id).toBe(1);
        expect(data[0]!.academicYear!.name).toBe('2021-2022');
      },
    );
  });
});
