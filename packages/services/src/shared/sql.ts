import type { PaginationInput } from '~/shared/pagination.model.ts';
import type { Filter } from '~/students/query.model.ts';
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

export const prepareValue = ({ operator, value }: Pick<Filter, 'value' | 'operator'>): string => {
  switch (operator) {
    case 'like':
    case 'nlike':
      return escape(`%${value as string}%`); //TODO remove % and put them directly in the value (to use startsWith and endsWith)
    // case 'in':
    // case 'nin':
    //   return `(${escape(value)})`;
    default:
      if (typeof value === 'number') return `'${escape(value)}'`; // TODO: this is to avoid having to typecast
      return escape(value as string);
  }
};

export const buildWhereClause = (
  whereField: string,
  operator: Filter['operator'],
  value: Filter['value'],
  raw = false,
): string => {
  const cleanValue = raw ? (value as string) : prepareValue({ operator, value });
  const isNull = value === null;
  switch (operator) {
    case 'eq':
      return isNull ? `${whereField} is null` : `${whereField} = ${cleanValue}`;
    case 'neq':
      return isNull
        ? `${whereField} is not null`
        : `(${whereField} != ${cleanValue} OR ${whereField} IS NULL)`;
    case 'gt':
      return `${whereField} > ${cleanValue}`;
    case 'gte':
      return `${whereField} >= ${cleanValue}`;
    case 'lt':
      return `${whereField} < ${cleanValue}`;
    case 'lte':
      return `${whereField} <= ${cleanValue}`;
    // case 'in':
    //   return `${whereField} IN ${cleanValue}`;
    // case 'nin':
    //   return `${whereField} NOT IN ${cleanValue}`;
    case 'like':
      return `${whereField} ILIKE ${cleanValue}`;
    case 'nlike':
      return `${whereField} NOT ILIKE ${cleanValue}`;
  }
};
