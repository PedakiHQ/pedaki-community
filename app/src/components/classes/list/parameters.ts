import { FilterSchema } from '@pedaki/services/classes/query.model.client';
import type { Filter } from '@pedaki/services/classes/query.model.client';
import {
  createParser,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsJson,
  parseAsNumberLiteral,
} from 'nuqs/parsers';

const sortingParser = createParser({
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

const filtersParser = createParser({
  parse: (raw: string) => {
    const [column, operator, value] = raw.split(':', 3);
    if (!column || !operator || !value) {
      return null;
    }
    const v = JSON.parse(value);
    const result = FilterSchema.safeParse({ field: column, operator: operator, value: v });
    if (result.success) {
      return result.data;
    }
    return null;
  },
  serialize: (value: Filter) => {
    return `${value.field}:${value.operator}:${JSON.stringify(value.value)}`;
  },
});

export const possiblesPerPage = [10, 25, 50, 100] as const;
export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral(possiblesPerPage).withDefault(25),
  sorting: parseAsArrayOf(sortingParser).withDefault([]),
  columns: parseAsJson<Record<string, boolean>>().withDefault({
    name: true,
    description: true,
    'academicYear.name': true,
    'level.name': true,
    'mainTeacher.name': true,
  }),
  filters: parseAsArrayOf(filtersParser).withDefault([]),
} as const;
export const serialize = createSerializer(searchParams);
export type PossiblePerPage = (typeof possiblesPerPage)[number];
