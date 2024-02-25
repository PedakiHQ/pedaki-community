'use client';

import { Button } from '@pedaki/design/ui/button';
import { useDebounce } from '@uidotdev/usehooks';
import { useRulesParams } from '~/components/classes/generate/parameters.tsx';
import { useFilterParams } from '~/components/datatable/client.tsx';
import { searchParams } from '~/components/students/list/parameters.ts';
import { api } from '~/server/clients/client.ts';
import { useClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import { useEffect } from 'react';

const RefetchQueryAction = () => {
  const [_filters] = useFilterParams(searchParams);
  const [_rules] = useRulesParams();
  const rulesWithoutDescription = _rules.map(rule => {
    const { description, ...rest } = rule;
    return rest;
  });
  const hasEdited = useClassesGenerateStore(store => store.hasEdited);
  const setHasEdited = useClassesGenerateStore(store => store.setHasEdited);

  const [filters, rules] = useDebounce([_filters, rulesWithoutDescription], 200);

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

  if (!hasEdited) return null;

  return (
    <div className="flex items-center gap-2 rounded-md bg-primary-lighter p-1">
      <Button variant="lighter-primary" size="sm" onClick={() => setHasEdited(false)}>
        Actualiser
      </Button>
      <p className="text-label-sm">Vous aller perdre toutes les modifications</p>
    </div>
  );
};

export default RefetchQueryAction;
