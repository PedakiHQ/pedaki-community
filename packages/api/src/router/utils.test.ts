import { filtersArrayToPrismaWhere, orderByArrayToPrismaOrderBy } from '~api/router/utils';
import { describe, expect, test } from 'vitest';

describe('utils', () => {
  describe('filtersArrayToPrismaWhere', () => {
    test('single operator - eq', () => {
      const filters = [{ field: 'id', operator: 'eq', value: 1 }];
      const result = filtersArrayToPrismaWhere(filters);
      expect(result).toEqual({ id: { equals: 1, mode: 'insensitive' } });
    });
    test('single operator - like', () => {
      const filters = [{ field: 'id', operator: 'like', value: 1 }];
      const result = filtersArrayToPrismaWhere(filters);
      expect(result).toEqual({ id: { contains: 1, mode: 'insensitive' } });
    });

    test('single negative operator - neq', () => {
      const filters = [{ field: 'id', operator: 'neq', value: 1 }];
      const result = filtersArrayToPrismaWhere(filters);
      expect(result).toEqual({ id: { not: { equals: 1 }, mode: 'insensitive' } });
    });
    test('single negative operator - nlike', () => {
      const filters = [{ field: 'id', operator: 'nlike', value: 1 }];
      const result = filtersArrayToPrismaWhere(filters);
      expect(result).toEqual({ id: { not: { contains: 1 }, mode: 'insensitive' } });
    });

    test('single nested field', () => {
      const filters = [{ field: 'level.id', operator: 'neq', value: 1 }];
      const result = filtersArrayToPrismaWhere(filters);
      expect(result).toEqual({ level: { id: { not: { equals: 1 }, mode: 'insensitive' } } });
    });

    test('no filters', () => {
      const result = filtersArrayToPrismaWhere([]);
      expect(result).toEqual({});
    });

    test('multiple filters on different field', () => {
      const filters = [
        { field: 'id', operator: 'eq', value: 1 },
        { field: 'level.id', operator: 'neq', value: 1 },
      ];
      const result = filtersArrayToPrismaWhere(filters);
      expect(result).toEqual({
        id: { equals: 1, mode: 'insensitive' },
        level: { id: { not: { equals: 1 }, mode: 'insensitive' } },
      });
    });

    test('multiple of the same field', () => {
      const filters = [
        { field: 'id', operator: 'eq', value: 1 },
        { field: 'id', operator: 'neq', value: 2 },
      ];
      const result = filtersArrayToPrismaWhere(filters);
      expect(result).toEqual({
        id: { equals: 1, mode: 'insensitive', not: { equals: 2 } },
      });
    });

    test('multiple of the same field and operator', () => {
      const filters = [
        { field: 'id', operator: 'eq', value: 1 },
        { field: 'id', operator: 'eq', value: 2 },
      ];
      const result = filtersArrayToPrismaWhere(filters);
      expect(result).toEqual({ id: { equals: 2, mode: 'insensitive' } });
    });
  });

  describe('orderByArrayToPrismaOrderBy', () => {
    test('single field', () => {
      const result = orderByArrayToPrismaOrderBy([['id', 'asc']]);
      expect(result).toEqual({ id: 'asc' });
    });

    test('single nested field', () => {
      const result = orderByArrayToPrismaOrderBy([['level.id', 'asc']]);
      expect(result).toEqual({ level: { id: 'asc' } });
    });

    test('multiple fields', () => {
      const result = orderByArrayToPrismaOrderBy([
        ['id', 'asc'],
        ['level.id', 'desc'],
      ]);
      expect(result).toEqual({ id: 'asc', level: { id: 'desc' } });
    });

    test('multiple of the same field', () => {
      const result = orderByArrayToPrismaOrderBy([
        ['id', 'asc'],
        ['id', 'desc'],
      ]);
      expect(result).toEqual({ id: 'desc' });
    });

    test('empty orderBy', () => {
      const result = orderByArrayToPrismaOrderBy([]);
      expect(result).toEqual({});
    });
  });
});
