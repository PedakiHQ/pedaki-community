import type { PaginationInput } from '~/shared/pagination.model.ts';
import type { Properties } from '~/students/student.model.ts';
import SqlString from 'sqlstring';

export const buildPaginationClause = (pagination: PaginationInput): string => {
  const page = pagination.page;
  const limit = pagination.limit;

  const offset = (page - 1) * limit;

  return `LIMIT ${limit} OFFSET ${offset}`;
};

export const prepareValue = ({
  operator,
  value,
}: Pick<Properties, 'value' | 'operator'>): string => {
  switch (operator) {
    case 'like':
    case 'nlike':
      return SqlString.escape(`%${value as string}%`);
    case 'in':
    case 'nin':
      return `(${SqlString.escape(value as string)})`;
    default:
      if (typeof value === 'number') return `'${SqlString.escape(value)}'`; // TODO: this is to avoid having to typecast
      return SqlString.escape(value as string);
  }
};
