import type { LevelRuleType } from '@pedaki/algorithms/generate_classes/input';
import { createParser, parseAsArrayOf, useQueryState } from 'nuqs';

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
    // TODO: rule type
    return { id: value as LevelRuleType };
  },
  serialize: (value: { id: LevelRuleType }) => {
    // TODO: rule type
    return value.id;
  },
});

export const useRulesParams = () => {
  return useQueryState(
    'rules',
    parseAsArrayOf(ruleParam).withOptions({ history: 'push', clearOnDefault: true }),
  );
};
