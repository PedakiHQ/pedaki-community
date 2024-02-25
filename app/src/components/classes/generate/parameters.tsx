import type { RawRule } from '@pedaki/algorithms/generate_classes/input.schema';
import { RawRuleSchema } from '@pedaki/algorithms/generate_classes/input.schema';
import { createParser, parseAsArrayOf, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { z } from 'zod';

const configParam = createParser({
  parse: (value: string) => {
    const [count, size] = value.split(':', 2);
    if (!count || !size) {
      return { count: 0, size: 10 };
    }
    return {
      count: Math.max(parseInt(count, 10), 0),
      size: Math.max(parseInt(size, 10), 1),
    };
  },
  serialize: (value: { count: number; size: number }) => {
    return `${value.count}:${value.size}`;
  },
});

export const useConfigurationParams = () => {
  return useQueryState(
    'config',
    configParam.withOptions({ history: 'replace', clearOnDefault: true }),
  );
};

const ruleParam = createParser({
  parse: (value: string) => {
    return RawRuleSchema.merge(z.object({ description: z.string().max(24).optional() })).parse(
      JSON.parse(value),
    );
  },
  serialize: (value: Omit<RawRule, 'priority'>) => {
    return JSON.stringify(value);
  },
});

// Ignore description when comparing rules to avoid unnecessary updates
export const ruleId = (rule: RawRule) => JSON.stringify({ ...rule, description: '' });

export const useRulesParams = () => {
  const [rules, setRules] = useQueryState(
    'rules',
    parseAsArrayOf(ruleParam)
      .withOptions({ history: 'push', clearOnDefault: true })
      .withDefault([]),
  );

  // add id to rules
  const rulesWithId = useMemo(
    () =>
      rules?.map(rule => ({
        ...rule,
        id: ruleId(rule),
      })),
    [rules],
  );
  return [rulesWithId, setRules] as const;
};
