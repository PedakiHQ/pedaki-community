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

type RuleMapping = {
  [key in LevelRuleType]: {
    key: key;
    icon: IconType;
    color: `#${string}`;
    attributesCount: 'none' | 'one_or_more' | 'two_or_more';
  } & (
    | {
        attributesCount: 'one_or_more' | 'two_or_more';
      }
    | {
        attributesCount: 'none';
      }
  );
};
export type RuleMappingValue = RuleMapping[keyof RuleMapping];

export const ruleMapping = {
  balance_class_count: {
    key: 'balance_class_count',
    icon: IconCircle,
    attributesCount: 'two_or_more',
    color: '#D6E6FF',
  },
  balance_count: {
    key: 'balance_count',
    icon: IconCalendar,
    attributesCount: 'one_or_more',
    color: '#D7F9F8',
  },
  gather_attributes: {
    key: 'gather_attributes',
    icon: IconSettings2,
    attributesCount: 'one_or_more',
    color: '#FFFFEA',
  },
  maximize_class_size: {
    key: 'maximize_class_size',
    icon: IconGripVertical,
    attributesCount: 'none',
    color: '#E5D4EF',
  },
  maximize_classes: {
    key: 'maximize_classes',
    icon: IconBookUser,
    attributesCount: 'none',
    color: '#FBE0E0',
  },
  negative_relationships: {
    key: 'negative_relationships',
    icon: IconX,
    attributesCount: 'none',
    color: '#FFF0D5',
  },
  positive_relationships: {
    key: 'positive_relationships',
    icon: IconPlus,
    attributesCount: 'none',
    color: '#FFDCF4',
  },
} as const satisfies RuleMapping;
