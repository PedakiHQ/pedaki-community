import { FilterSchema } from '@pedaki/services/students/query.model.client';
import type { Filter } from '@pedaki/services/students/query.model.client';
import {
  createFiltersParser,
  possiblesPerPage,
  sortingParser,
} from '~/components/datatable/parameters';
import {
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsJson,
  parseAsNumberLiteral,
} from 'nuqs/parsers';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsNumberLiteral(possiblesPerPage).withDefault(25),
  sorting: parseAsArrayOf(sortingParser).withDefault([]),
  columns: parseAsJson<Record<string, boolean>>().withDefault({
    firstName: true,
    lastName: true,
    'class.name': true,
  }),
  filters: parseAsArrayOf(createFiltersParser<Filter>(FilterSchema)).withDefault([]),
} as const;
export const serialize = createSerializer(searchParams);
