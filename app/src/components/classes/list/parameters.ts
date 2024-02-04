import { FilterSchema } from '@pedaki/services/classes/query.model.client';
import type { Filter } from '@pedaki/services/classes/query.model.client';
import { possiblesPerPage, sortingParser } from '~/components/datatable/parameters';
import {
  createParser,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsJson,
  parseAsNumberLiteral,
} from 'nuqs/parsers';

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
