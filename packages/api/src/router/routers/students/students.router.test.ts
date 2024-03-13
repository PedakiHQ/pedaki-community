import { assertTrpcError, assertZodError } from '@pedaki/tests/error';
import { assertIsAuthenticated } from '@pedaki/tests/middleware.js';
import {
  getAnonymousSession,
  getInternalSession,
  getUserSession,
} from '~api/tests/helpers/sessions.ts';
import { describe, expect, test } from 'vitest';

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
        const { data, meta } = await api.students.getMany({
          fields: ['id'],
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
      'returns the 1st page - with filter - $type',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['id'],
          where: [
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
      'returns the 1st page - with many filter - $type',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['firstName', 'properties.1'],
          where: [
            {
              field: 'firstName',
              operator: 'like',
              value: 'Natha',
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
              field: 'properties.1',
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
        expect(data[0]!.firstName).toBe('Nathan');
        expect(data[0]!.properties!['1']).toBe(15);
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with join field on one level - $type',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['firstName', 'properties.1', 'class.name'],
          where: [],
          pagination: {
            page: 1,
            limit: 10,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(10);
        expect(data[0]!.class.name).toBeDefined();
        expect(data[0]!.firstName).toBe('Nathan');
        expect(data[0]!.properties!['1']).toBe(15);
        expect(data[0]!.class.name).toBe('6ème B');
        expect(data[1]!.class).toBeDefined();
        expect(data[1]!.class.name).toBeUndefined(); // In our test data only the first user has a class
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with join fields on one level - $type',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['firstName', 'properties.1', 'class.name', 'class.academicYearId'],
          where: [],
          pagination: {
            page: 1,
            limit: 10,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(10);
        expect(data[0]!.class.name).toBeDefined();
        expect(data[0]!.firstName).toBe('Nathan');
        expect(data[0]!.properties!['1']).toBe(15);
        expect(data[0]!.class.name).toBe('6ème B');
        expect(data[0]!.class.academicYearId).toBe(1);
        expect(data[1]!.class).toBeDefined();
        expect(data[1]!.class.name).toBeUndefined(); // In our test data only the first user has a class
        expect(data[1]!.class.academicYearId).toBeUndefined();
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with join filter on one level - $type',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['firstName', 'properties.1'],
          where: [
            {
              field: 'class.name',
              operator: 'eq',
              value: '6ème B',
            },
          ],
          pagination: {
            page: 1,
            limit: 1,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(1);
        expect(data[0]!.firstName).toBe('Nathan');
        expect(data[0]!.properties!['1']).toBe(15);
      },
    );

    test.each([userSession, internalSession])(
      'fails with invalid property type - $type',
      async ({ api }) => {
        try {
          await api.students.getMany({
            fields: ['firstName', 'properties.1'],
            where: [
              {
                field: 'properties.1',
                operator: 'eq',
                value: 'a', // expect a integer
              },
            ],
            pagination: {
              page: 1,
              limit: 1,
            },
          });
          expect.fail('Expected an error to be thrown');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          assertZodError(e, [
            {
              path: ['properties.1', 'value'],
              message: 'Expected number, received string',
            },
          ]);
        }
      },
    );

    test.each([userSession, internalSession])(
      'fails with unknown property - $type',
      async ({ api }) => {
        try {
          await api.students.getMany({
            fields: ['firstName', 'properties.unknown'],
            pagination: {
              page: 1,
              limit: 1,
            },
          });
          expect.fail('Expected an error to be thrown');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          // TODO error message
        }

        try {
          await api.students.getMany({
            fields: ['firstName'],
            where: [
              {
                field: 'properties.unknown',
                operator: 'eq',
                value: 'a',
              },
            ],
            pagination: {
              page: 1,
              limit: 1,
            },
          });
          expect.fail('Expected an error to be thrown');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          // TODO error message
        }
      },
    );

    test.each([userSession, internalSession])(
      'fails with invalid key name - $type',
      async ({ api }) => {
        try {
          await api.students.getMany({
            fields: ['firstName', 'properties.'],
            pagination: {
              page: 1,
              limit: 1,
            },
          });
          expect.fail('Expected an error to be thrown');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          // TODO error message
        }

        try {
          await api.students.getMany({
            fields: ['firstName'],
            where: [
              {
                field: 'properties.',
                operator: 'eq',
                value: 'a',
              },
            ],
            pagination: {
              page: 1,
              limit: 1,
            },
          });
          expect.fail('Expected an error to be thrown');
        } catch (e) {
          assertTrpcError(e, 'BAD_REQUEST');
          // TODO error message
        }
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with join filters on one level - $type',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['firstName', 'properties.1'],
          where: [
            {
              field: 'class.name',
              operator: 'eq',
              value: '6ème B',
            },
            {
              field: 'class.academicYearId',
              operator: 'eq',
              value: 1,
            },
          ],
          pagination: {
            page: 1,
            limit: 1,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(1);
        expect(data[0]!.firstName).toBe('Nathan');
        expect(data[0]!.properties!['1']).toBe(15);
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with join fields and filters on one level - $type',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['firstName', 'properties.1', 'class.name'],
          where: [
            {
              field: 'class.name',
              operator: 'eq',
              value: '6ème B',
            },
          ],
          pagination: {
            page: 1,
            limit: 1,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(1);
        expect(data[0]!.firstName).toBe('Nathan');
        expect(data[0]!.properties!['1']).toBe(15);
        expect(data[0]!.class.name).toBe('6ème B');
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with join fields on two level - $type',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['firstName', 'properties.1', 'class.teachers.id'],
          where: [
            {
              field: 'class.name',
              operator: 'eq',
              value: '6ème B',
            },
          ],
          pagination: {
            page: 1,
            limit: 1,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(1);
        expect(data[0]!.firstName).toBe('Nathan');
        expect(data[0]!.properties!['1']).toBe(15);
        expect(data[0]!.class.teachers).toBeDefined();
        expect(data[0]!.class.teachers).toHaveLength(3);
        expect(data[0]!.class.teachers).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with join filter on two level - $type',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['firstName', 'properties.1'],
          where: [
            {
              field: 'class.teachers.id',
              operator: 'gte',
              value: 1,
            },
          ],
          pagination: {
            page: 1,
            limit: 1,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(1);
        expect(data[0]!.firstName).toBe('Nathan');
        expect(data[0]!.properties!['1']).toBe(15);
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with join filter and fields on two level - $type',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['firstName', 'properties.1', 'class.teachers.name'],
          where: [
            {
              field: 'class.teachers.id',
              operator: 'lte',
              value: 2,
            },
          ],
          pagination: {
            page: 1,
            limit: 1,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(1);
        expect(data[0]!.firstName).toBe('Nathan');
        expect(data[0]!.properties!['1']).toBe(15);
        expect(data[0]!.class.teachers).toBeDefined();
        expect(data[0]!.class.teachers).toHaveLength(2);
        expect(data[0]!.class.teachers).toStrictEqual([
          { name: 'Teacher 1' },
          { name: 'Teacher 2' },
        ]);
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with join filter and fields on two level and ordered - $type',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['firstName', 'properties.1', 'class.teachers.name'],
          where: [
            {
              field: 'properties.1',
              operator: 'gte',
              value: 5,
            },
          ],
          orderBy: [['properties.1', 'asc']],
          pagination: {
            page: 1,
            limit: 50,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(50);

        let previousValue = 0;
        data.forEach(student => {
          const value = student.properties!['1']! as number;
          expect(value).toBeGreaterThanOrEqual(previousValue);
          expect(value).toBeGreaterThanOrEqual(5);
          previousValue = value;
        });
      },
    );

    test.each([userSession, internalSession])(
      'returns the 1st page - with join filter and fields on two level and ordered twice - $type',
      async ({ api }) => {
        const { data, meta } = await api.students.getMany({
          fields: ['firstName', 'properties.1', 'class.teachers.name'],
          where: [
            {
              field: 'properties.1',
              operator: 'neq',
              value: 5,
            },
            {
              field: 'properties.1',
              operator: 'neq',
              value: 6,
            },
          ],
          orderBy: [
            ['properties.1', 'asc'],
            ['firstName', 'desc'],
          ],
          pagination: {
            page: 1,
            limit: 100,
          },
        });

        expect(meta.currentPage).toBe(1);
        expect(data.length).toBe(100);

        let previousValue = 0;
        let lastFirstName = '';
        data.forEach(student => {
          const value = student.properties!['1'] as number;
          const firstName = student.firstName!;
          expect(value).toBeGreaterThanOrEqual(previousValue);
          expect(value).not.toBe(5);
          expect(value).not.toBe(6);
          if (value === previousValue && lastFirstName !== '') {
            expect(firstName <= lastFirstName).toBe(true);
          }
          lastFirstName = firstName;
          previousValue = value;
        });
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
      expect(student!.id).toBe(1);
    });
  });

  describe('createOne', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(
          () =>
            api.students.createOne({
              firstName: 'John',
              lastName: 'Doe',
              birthDate: new Date('2001-01-01'),
              gender: 'M',
            }),
          {
            shouldWork: type !== 'anonymousUserSession',
          },
        );
      },
    );

    test.each([userSession, internalSession])('creates a student - $type', async ({ api }) => {
      const student = await api.students.createOne({
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date('2001-01-01'),
        gender: 'M',
        properties: {
          shrek: 'is love',
        },
      });

      expect(student).toBeDefined();
      expect(student.id).toBeDefined();
      expect(student.firstName).toBe('John');
      expect(student.lastName).toBe('Doe');
      expect(student.birthDate.toISOString()).toBe('2001-01-01T00:00:00.000Z');
      expect(student.properties!.shrek).toBe('is love');

      const student2 = await api.students.getOne({ id: student.id });
      expect(student2).toBeDefined();
      expect(student2!.id).toBe(student.id);
      expect(student2!.firstName).toBe('John');
      expect(student2!.lastName).toBe('Doe');
      expect(student2!.birthDate.toISOString()).toBe('2001-01-01T00:00:00.000Z');
      expect(student2!.properties!.shrek).toBe('is love');
    });
  });

  describe('updateOne', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(
          () =>
            api.students.updateOne({
              id: 1,
              firstName: 'John',
            }),
          {
            shouldWork: type !== 'anonymousUserSession',
          },
        );
      },
    );

    test.each([userSession, internalSession])('updates a student - $type', async ({ api }) => {
      const oldStudent = await api.students.getOne({ id: 1 });

      const randomValue = Math.random();
      await api.students.updateOne({
        id: 1,
        firstName: 'John',
        properties: {
          shrek: 'is life',
          random: randomValue,
        },
      });

      const student2 = await api.students.getOne({ id: 1 });

      expect(oldStudent).toBeDefined();
      expect(student2).toBeDefined();
      expect(student2!.id).toBe(oldStudent!.id);
      expect(student2!.firstName).toBe('John');
      expect(student2!.properties!.shrek).toBe('is life');
      expect(student2!.properties!.random).toBe(randomValue);

      // Old values should not have changed
      expect(student2!.lastName).toBe(oldStudent!.lastName);
      expect(student2!.properties!['1']).toBe(oldStudent!.properties!['1']);
    });
  });

  describe('deleteOne', () => {
    test.each([anonymousSession, userSession, internalSession])(
      'need to be authenticated to use this route - $type',
      async ({ api, type }) => {
        await assertIsAuthenticated(() => api.students.deleteOne({ id: 1 }), {
          shouldWork: type !== 'anonymousUserSession',
        });
      },
    );

    test.each([userSession, internalSession])('deletes a student - $type', async ({ api }) => {
      const student = await api.students.createOne({
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date('2001-01-01'),
        gender: 'M',
        properties: {
          shrek: 'is love',
        },
      });

      const student2 = await api.students.getOne({ id: student.id });
      expect(student2).toBeDefined();

      await api.students.deleteOne({ id: student.id });

      const student3 = await api.students.getOne({ id: student.id });
      expect(student3).toBeNull();
    });
  });
});
