import type { DefaultFilter } from '@pedaki/services/utils/query';
import {
  createParser,
  parseAsArrayOf,
  parseAsInteger,
  parseAsJson,
  parseAsNumberLiteral,
} from 'nuqs/parsers';
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
  U extends DefaultFilter = DefaultFilter,
  T extends ReturnType<typeof createFiltersParser<U>> = ReturnType<typeof createFiltersParser<U>>,
>(
  columns: Record<string, boolean>,
  filterParser: T,
) => ({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral(possiblesPerPage).withDefault(25),
  sorting: parseAsArrayOf(sortingParser).withDefault([]),
  columns: parseAsJson<Record<string, boolean>>().withDefault(columns),
  filters: parseAsArrayOf(filterParser).withDefault([]),
});

export const possiblesPerPage = [10, 25, 50, 100] as const;
export type PossiblePerPage = (typeof possiblesPerPage)[number];
