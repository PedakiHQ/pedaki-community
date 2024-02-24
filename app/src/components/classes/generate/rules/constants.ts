import type { LevelRuleType } from '@pedaki/algorithms/generate_classes/input';
import type { IconType } from '@pedaki/design/ui/icons';
import {
  IconBookUser,
  IconCalendar,
  IconCircle,
  IconGripVertical,
  IconPlus,
  IconSettings2,
  IconX,
} from '@pedaki/design/ui/icons';

type CanBeAdded = (rules: LevelRuleType[]) => readonly [string, string] | null; // error code or null

type RuleMapping = {
  [key in LevelRuleType]: {
    key: key;
    icon: IconType;
    color: `#${string}`;
    attributesCount: 'none' | 'one' | 'two_or_more';
    canBeAdded: CanBeAdded; // error code or null
  };
};
export type RuleMappingValue = RuleMapping[keyof RuleMapping];

const onlyOneOfType = (type: LevelRuleType) => {
  return (rules: LevelRuleType[]) => {
    if (rules.includes(type)) {
      return ['only_one_of_type', type] as const;
    }
    return null;
  };
};

const incompatibleWith = (type: LevelRuleType) => {
  return (rules: LevelRuleType[]) => {
    if (rules.includes(type)) {
      return ['incompatible_with', type] as const;
    }
    return null;
  };
};

const noCondition = (_: LevelRuleType[]) => {
  return null;
};

const chain = (...conditions: CanBeAdded[]): CanBeAdded => {
  return rules => {
    for (const condition of conditions) {
      const result = condition(rules);
      if (result !== null) {
        return result;
      }
    }
    return null;
  };
};

export const ruleMapping = {
  balance_class_count: {
    key: 'balance_class_count',
    icon: IconCircle,
    attributesCount: 'two_or_more',
    color: '#D6E6FF',
    canBeAdded: noCondition,
  },
  balance_count: {
    key: 'balance_count',
    icon: IconCalendar,
    attributesCount: 'one',
    color: '#D7F9F8',
    canBeAdded: noCondition,
  },
  gather_attributes: {
    key: 'gather_attributes',
    icon: IconSettings2,
    attributesCount: 'one',
    color: '#FFFFEA',
    canBeAdded: noCondition,
  },
  maximize_class_size: {
    key: 'maximize_class_size',
    icon: IconGripVertical,
    attributesCount: 'none',
    color: '#E5D4EF',
    canBeAdded: chain(incompatibleWith('maximize_classes'), onlyOneOfType('maximize_class_size')),
  },
  maximize_classes: {
    key: 'maximize_classes',
    icon: IconBookUser,
    attributesCount: 'none',
    color: '#FBE0E0',
    canBeAdded: chain(incompatibleWith('maximize_class_size'), onlyOneOfType('maximize_classes')),
  },
  negative_relationships: {
    key: 'negative_relationships',
    icon: IconX,
    attributesCount: 'none',
    color: '#FFF0D5',
    canBeAdded: onlyOneOfType('negative_relationships'),
  },
  positive_relationships: {
    key: 'positive_relationships',
    icon: IconPlus,
    attributesCount: 'none',
    color: '#FFDCF4',
    canBeAdded: onlyOneOfType('positive_relationships'),
  },
} as const satisfies RuleMapping;
