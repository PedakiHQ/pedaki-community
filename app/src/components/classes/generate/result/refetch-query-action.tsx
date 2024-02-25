'use client';

import { Button } from '@pedaki/design/ui/button';
import { useRulesParams } from '~/components/classes/generate/parameters.tsx';
import { useFilterParams } from '~/components/datatable/client.tsx';
import { searchParams } from '~/components/students/list/parameters.ts';
import { api } from '~/server/clients/client.ts';
import { useClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import deepEqual from 'fast-deep-equal';
import { useEffect, useRef } from 'react';

const RefetchQueryAction = () => {
  const [filters] = useFilterParams(searchParams);
  const [rules] = useRulesParams();
  const rulesWithoutDescription = rules.map(rule => {
    const { description, ...rest } = rule;
    return rest;
  });

  const previousFilters = useRef<typeof filters | undefined>(filters);
  const previousRules = useRef<typeof rules | undefined>(rules);
  const hasChanged = useRef(false);

  const hasEdited = useClassesGenerateStore(store => store.hasEdited);
  const setHasEdited = useClassesGenerateStore(store => store.setHasEdited);

  const { data } = api.students.getMany.useQuery(
    {
      fields: ['firstName', 'lastName'],
      where: filters,
      pagination: {
        page: 1,
        limit: 1000,
      },
    },
    {
      enabled: !hasEdited,
    },
  );

  useEffect(() => {
    const filtersChanged = deepEqual(previousFilters.current, filters);
    const rulesChanged = deepEqual(
      previousRules.current?.map(r => r.id),
      rulesWithoutDescription.map(r => r.id),
    );
    if (!filtersChanged || !rulesChanged) {
      if (hasEdited) hasChanged.current = true;
      previousFilters.current = filters;
      previousRules.current = rulesWithoutDescription;
    }
  }, [hasEdited, filters, rulesWithoutDescription]);

  const refetch = () => {
    previousFilters.current = filters;
    previousRules.current = rules;
    hasChanged.current = false;
    setHasEdited(false);
  };

  if (hasEdited && hasChanged.current) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-primary-lighter p-1">
        <Button variant="lighter-primary" size="sm" onClick={refetch}>
          Actualiser
        </Button>
        <div className="">
          <p className="text-label-sm">En actualisant, les modifications seront perdues.</p>
        </div>
      </div>
    );
  }
  return null;
};

export default RefetchQueryAction;
