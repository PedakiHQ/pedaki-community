import { FilterSchema } from '@pedaki/services/students/query.model.client';
import type { Filter } from '@pedaki/services/students/query.model.client';
import { createFiltersParser, createSearchParams } from '~/components/datatable/parameters';
import { createSerializer } from 'nuqs/server';

export const searchParams = createSearchParams<Filter>(
  {
    firstName: true,
    lastName: true,
    'class.name': true,
  },
  createFiltersParser<Filter>(FilterSchema),
);

export const serialize = createSerializer(searchParams);
