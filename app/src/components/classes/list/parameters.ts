import { FilterSchema } from '@pedaki/services/classes/query.model.client';
import type { Filter } from '@pedaki/services/classes/query.model.client';
import { createFiltersParser, createSearchParams } from '~/components/datatable/parameters';
import { createSerializer } from 'nuqs/parsers';

export const searchParams = createSearchParams<Filter>(
  {
    name: true,
    description: true,
    'academicYear.name': true,
    'level.name': true,
    'mainTeacher.name': true,
  },
  createFiltersParser<Filter>(FilterSchema),
);

export const serialize = createSerializer(searchParams);
