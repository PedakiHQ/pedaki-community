import { useQueryState } from 'nuqs';
import { createSerializer, parseAsArrayOf, parseAsInteger, parseAsStringEnum } from 'nuqs/parsers';
import type { TransitionStartFunction } from 'react';

export const possibleFilters = ['DONE', 'IGNORED', 'PENDING'] as const;
export const searchParams = {
  id: parseAsInteger,
  // @ts-expect-error: nuqs type issue when using const enum
  filter: parseAsArrayOf(parseAsStringEnum(possibleFilters)).withDefault(['PENDING']),
} as const;
export const serialize = createSerializer(searchParams);

export const useIdParam = (startTransition?: TransitionStartFunction) => {
  return useQueryState(
    'id',
    searchParams.id.withOptions({
      history: 'replace',
      startTransition,
    }),
  );
};

export const useFilterParam = () => {
  return useQueryState(
    'filter',
    searchParams.filter.withOptions({
      history: 'replace',
    }),
  );
};
