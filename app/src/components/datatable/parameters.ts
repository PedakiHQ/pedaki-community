import type { DefaultFilter } from '@pedaki/services/utils/query';
import {
  createParser,
  parseAsArrayOf,
  parseAsInteger,
  parseAsJson,
  parseAsNumberLiteral,
} from 'nuqs/server';
import type { z } from 'zod';

export const createFiltersParser = <T extends DefaultFilter, U extends z.Schema = z.Schema>(
  schema: U,
) =>
  createParser({
    parse: (raw: string) => {
      const [column, operator, value] = raw.split(':', 3);
      if (!column || !operator || !value) {
        return null;
      }
      const v = JSON.parse(value);
      const result = schema.safeParse({ field: column, operator: operator, value: v });
      if (result.success) {
        // TODO: fix type
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result.data as z.output<U>;
      }
      return null;
    },
    serialize: (value: T) => {
      return `${value.field}:${value.operator}:${JSON.stringify(value.value)}`;
    },
  });
export type CreateFiltersParser<
  T extends DefaultFilter,
  U extends z.Schema = z.Schema,
> = ReturnType<typeof createFiltersParser<T, U>>;

export const sortingParser = createParser({
  parse: (value: string) => {
    const [column, direction] = value.split(':', 2);
    if (direction !== 'asc' && direction !== 'desc') {
      return null;
    }
    return {
      id: column!,
      desc: direction === 'desc',
    };
  },
  serialize: (value: { id: string; desc: boolean }) => {
    return `${value.id}:${value.desc ? 'desc' : 'asc'}`;
  },
});

export const createSearchParams = <
  T extends DefaultFilter = DefaultFilter,
  U extends CreateFiltersParser<T> = CreateFiltersParser<T>,
>(
  defaultColumns: Record<string, boolean>,
  filterParser: U,
) => ({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral(possiblesPerPage).withDefault(25),
  sorting: parseAsArrayOf(sortingParser).withDefault([]),
  columns: parseAsJson<Record<string, boolean>>().withDefault(defaultColumns),
  filters: parseAsArrayOf(filterParser).withDefault([]),
});
export type CreateSearchParams<
  T extends DefaultFilter = DefaultFilter,
  U extends CreateFiltersParser<T> = CreateFiltersParser<T>,
> = ReturnType<typeof createSearchParams<T, U>>;

export const possiblesPerPage = [10, 25, 50, 100] as const;
export type PossiblePerPage = (typeof possiblesPerPage)[number];
