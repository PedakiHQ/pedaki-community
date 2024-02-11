'use client';

import type { DefaultFilter } from '@pedaki/services/utils/query';
import type { CreateFiltersParser, CreateSearchParams } from '~/components/datatable/parameters';
import { useQueryState } from 'nuqs';
import type { TransitionStartFunction } from 'react';

export const usePageParams = <
  T extends DefaultFilter = DefaultFilter,
  U extends CreateFiltersParser<T> = CreateFiltersParser<T>,
>(
  searchParams: CreateSearchParams<T, U>,
  startTransition?: TransitionStartFunction,
) => {
  return useQueryState('page', searchParams.page.withOptions({ history: 'push', startTransition }));
};

export const useSortingParams = <
  T extends DefaultFilter = DefaultFilter,
  U extends CreateFiltersParser<T> = CreateFiltersParser<T>,
>(
  searchParams: CreateSearchParams<T, U>,
  startTransition?: TransitionStartFunction,
) => {
  return useQueryState(
    'sorting',
    searchParams.sorting.withOptions({ history: 'replace', startTransition }),
  );
};

export const useFilterParams = <
  T extends DefaultFilter = DefaultFilter,
  U extends CreateFiltersParser<T> = CreateFiltersParser<T>,
>(
  searchParams: CreateSearchParams<T, U>,
  startTransition?: TransitionStartFunction,
) => {
  return useQueryState(
    'filter',
    searchParams.filters.withOptions({ history: 'push', startTransition }),
  );
};

export const usePerPageParams = <
  T extends DefaultFilter = DefaultFilter,
  U extends CreateFiltersParser<T> = CreateFiltersParser<T>,
>(
  searchParams: CreateSearchParams<T, U>,
  startTransition?: TransitionStartFunction,
) => {
  return useQueryState(
    'perPage',
    searchParams.perPage.withOptions({ history: 'replace', startTransition }),
  );
};

export const useColumnsVisibilityParams = <
  T extends DefaultFilter = DefaultFilter,
  U extends CreateFiltersParser<T> = CreateFiltersParser<T>,
>(
  searchParams: CreateSearchParams<T, U>,
  startTransition?: TransitionStartFunction,
) => {
  return useQueryState(
    'columns',
    searchParams.columns.withOptions({ history: 'replace', startTransition }),
  );
};
