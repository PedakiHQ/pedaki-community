'use client';

import { Button } from '@pedaki/design/ui/button';
import type { RawRule } from '@pedaki/services/algorithms/generate_classes/input.schema';
import {
  useConfigurationParams,
  useRulesParams,
} from '~/components/classes/generate/parameters.tsx';
import { useFilterParams } from '~/components/datatable/client.tsx';
import { searchParams } from '~/components/students/list/parameters.ts';
import { api } from '~/server/clients/client.ts';
import { useClassesGenerateStore } from '~/store/classes/generate/generate.store.ts';
import deepEqual from 'fast-deep-equal';
import { useEffect, useRef } from 'react';

const prepareRules = (rules: RawRule[]): RawRule[] => {
  const length = rules.length;
  return rules.map((rule, index) => {
    return {
      ...rule,
      priority: length - index,
    };
  });
};

const RefetchQueryAction = () => {
  const [filters] = useFilterParams(searchParams);
  const [rules] = useRulesParams();
  const [config] = useConfigurationParams();
  const rulesWithoutDescription = rules.map(rule => {
    const { description, ...rest } = rule;
    return rest;
  });

  const previousFilters = useRef<typeof filters | undefined>(filters);
  const previousRules = useRef<typeof rules | undefined>(rules);
  const previousConfig = useRef<typeof config | undefined>(config);
  const hasChanged = useRef(false);

  const hasEdited = useClassesGenerateStore(store => store.hasEdited);
  const setHasEdited = useClassesGenerateStore(store => store.setHasEdited);

  const { data } = api.classes.generator.create.useQuery(
    {
      where: filters,
      // @ts-expect-error: It's bugged ?
      rules: prepareRules(rulesWithoutDescription),
      constraints: {
        class_size_limit: config.size,
        class_amount_limit: config.count,
      },
    },
    {
      enabled: !hasEdited,
      staleTime: Infinity,
    },
  );

  const flatIds = data && data.classes.map(c => c.students).flat();

  useEffect(() => {
    const filtersChanged = deepEqual(previousFilters.current, filters);
    const configChanged = deepEqual(previousFilters.current, config);
    const rulesChanged = deepEqual(
      previousRules.current?.map(r => r.id),
      rulesWithoutDescription.map(r => r.id),
    );
    if (!filtersChanged || !rulesChanged || !configChanged) {
      if (hasEdited) hasChanged.current = true;
      previousFilters.current = filters;
      previousRules.current = rulesWithoutDescription;
      previousConfig.current = config;
    }
  }, [hasEdited, filters, rulesWithoutDescription, config]);

  const forceRefetch = () => {
    previousFilters.current = filters;
    previousRules.current = rules;
    previousConfig.current = config;
    hasChanged.current = false;
    setHasEdited(false);
  };

  if (hasEdited && hasChanged.current) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-primary-lighter p-1">
        <Button variant="lighter-primary" size="sm" onClick={forceRefetch}>
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
