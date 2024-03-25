import { FilterSchema } from '@pedaki/services/classes/query.model.client';
import type { Filter } from '@pedaki/services/classes/query.model.client';
import { createFiltersParser, createSearchParams } from '~/components/datatable/parameters';
import { createSerializer } from 'nuqs/server';

export const defaultColumns = {
  name: true,
  description: true,
  'academicYear.name': true,
  'level.name': true,
  'mainTeacher.name': true,
};

export const searchParams = createSearchParams<Filter>(
  defaultColumns,
  createFiltersParser<Filter>(FilterSchema),
);

export const serialize = createSerializer(searchParams);
