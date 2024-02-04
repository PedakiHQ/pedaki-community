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

  describe('getMany', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(() => api.classes.getMany(), {
          shouldWork: type !== 'anonymousUserSession',
        });
      },
    );
    test.each([userSession, internalSession])('returns at least one result', async ({ api }) => {
      const data = await api.classes.getMany();
      expect(Object.values(data).length).toBeGreaterThan(0);
    });
  });

  describe('getPaginatedMany', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(
          () =>
            api.classes.getPaginatedMany({
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
        const { data, meta } = await api.classes.getPaginatedMany({
          fields: ['id'],
          pagination: {
            page: 1,
            limit: 3,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(3);
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with filter - $type',
      async ({ api }) => {
        const { data, meta } = await api.classes.getPaginatedMany({
          fields: ['id', 'name'],
          where: [{ field: 'name', operator: 'eq', value: '6ème A' }],
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
        const { data, meta } = await api.classes.getPaginatedMany({
          fields: ['id', 'name'],
          where: [
            { field: 'description', operator: 'eq', value: 'Class A' },
            { field: 'level.id', operator: 'eq', value: 2 },
          ],
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
      'returns the 1st page - with many filter and negation - $type',
      async ({ api }) => {
        const { data, meta } = await api.classes.getPaginatedMany({
          fields: ['id', 'name'],
          where: [
            { field: 'description', operator: 'eq', value: 'Class A' },
            { field: 'level.id', operator: 'neq', value: 1 },
          ],
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
        const { data, meta } = await api.classes.getPaginatedMany({
          fields: ['id', 'name', 'academicYear.id', 'academicYear.name'],
          where: [{ field: 'id', operator: 'eq', value: 1 }],
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

    test.each([userSession, internalSession])(
      'returns the 1st page - with filter and order asc - $type',
      async ({ api }) => {
        const { data, meta } = await api.classes.getPaginatedMany({
          fields: ['id', 'name'],
          where: [{ field: 'academicYear.id', operator: 'eq', value: 1 }],
          orderBy: [['name', 'asc']],
          pagination: {
            page: 1,
            limit: 2,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(2);
        expect(data[0]!.id).toBe(1);
        expect(data[0]!.name).toBe('6ème A');
        expect(data[1]!.id).toBe(2);
        expect(data[1]!.name).toBe('6ème B');
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with filter and order desc - $type',
      async ({ api }) => {
        const { data, meta } = await api.classes.getPaginatedMany({
          fields: ['id', 'name'],
          where: [{ field: 'academicYear.id', operator: 'eq', value: 1 }],
          orderBy: [['name', 'desc']],
          pagination: {
            page: 1,
            limit: 2,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(2);
        expect(data[1]!.id).toBe(1);
        expect(data[1]!.name).toBe('6ème A');
        expect(data[0]!.id).toBe(2);
        expect(data[0]!.name).toBe('6ème B');
      },
    );
  });
});
