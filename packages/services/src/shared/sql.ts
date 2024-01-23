import type { PaginationInput } from '~/shared/pagination.model.ts';
import type { Properties } from '~/students/student.model.ts';
import SqlString from 'sqlstring';

export const buildPaginationClause = (pagination: PaginationInput): string => {
  const page = pagination.page;
  const limit = pagination.limit;

  const offset = (page - 1) * limit;

  return `LIMIT ${limit} OFFSET ${offset}`;
};

export const escape = (value: any): string => {
  return SqlString.escape(value);
};

export const getJsonBType = (value: unknown): string => {
  if (typeof value === 'string') return 'text';
  if (typeof value === 'number') return 'numeric';
  if (typeof value === 'boolean') return 'boolean';
  if (value instanceof Date) return 'timestamp';
  if (Array.isArray(value)) return 'jsonb';
  return 'jsonb';
};

export const prepareValue = ({
  operator,
  value,
}: Pick<Properties, 'value' | 'operator'>): string => {
  switch (operator) {
    case 'like':
    case 'nlike':
      return escape(`%${value as string}%`); //TODO remove % and put them directly in the value (to use startsWith and endsWith)
    case 'in':
    case 'nin':
      return `(${escape(value)})`;
    default:
      if (typeof value === 'number') return `'${escape(value)}'`; // TODO: this is to avoid having to typecast
      return escape(value as string);
  }
};
