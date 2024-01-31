import { readFileSync } from 'fs';
import { prisma } from '@pedaki/db';
import { assertIsAuthenticated } from '@pedaki/tests/middleware';
import {
  getAnonymousSession,
  getInternalSession,
  getUserSession,
} from '~api/tests/helpers/sessions.ts';
import { describe, expect, test } from 'vitest';

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

  describe('scenarios', () => {
    test.each([userSession, internalSession])('upload siecle file - $type', async ({ api }) => {
      const siecleFile = readFileSync(__dirname + '/../../../../../data/valid-siecle.csv');
      const response = await api.students.imports.upload({
        buffer: Buffer.from(siecleFile),
        mimeType: 'text/csv',
      });
      expect(response).toBeDefined();
      expect(response.id).toBeDefined();

      let status;
      do {
        status = await api.students.imports.status({
          id: response.id,
        });
        await new Promise(resolve => setTimeout(resolve, 100));
      } while (status.status !== 'ERROR' && status.status !== 'DONE');

      expect(status.status).toBe('DONE');
      expect(status.data).toBeDefined();
      expect(status.data!.family).toBe('siecle');
      expect(status.data!.students!.mappedCount).toBe(1);
      expect(status.data!.students!.insertedCount).toBe(367);
      expect(status.data!.levels!.mappedCount).toBe(2);

      // Students
      const importStudentsCount = await prisma.importStudent.count({
        where: {
          importId: response.id,
        },
      });
      expect(importStudentsCount).toBe(367);

      const importStudentMapped = await prisma.importStudent.findMany({
        where: {
          importId: response.id,
          studentId: {
            not: null,
          },
        },
      });
      expect(importStudentMapped.length).toBe(1);
      expect(importStudentMapped[0]!.firstName).toBe('Nathan');
      expect(importStudentMapped[0]!.lastName).toBe('Dupont');

      // Classes
      const importClassesCount = await prisma.importClass.count({
        where: {
          importId: response.id,
        },
      });
      expect(importClassesCount).toBe(22);

      const importClassMapped = await prisma.importClass.findMany({
        where: {
          importId: response.id,
          classId: {
            not: null,
          },
        },
      });
      expect(importClassMapped.length).toBe(0);

      // Levels
      const importLevelsCount = await prisma.importClassLevel.count({
        where: {
          importId: response.id,
        },
      });
      expect(importLevelsCount).toBe(5);

      const importLevelMapped = await prisma.importClassLevel.findMany({
        where: {
          importId: response.id,
          classLevelId: {
            not: null,
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
      expect(importLevelMapped.length).toBe(2);
      expect(importLevelMapped[0]!.name).toBe('CE1');
      expect(importLevelMapped[1]!.name).toBe('CP');
    });
  });
});
