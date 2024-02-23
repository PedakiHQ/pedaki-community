import type { RuleMappingValue } from '~/components/classes/generate/rules/constants.ts';
import React from 'react';

interface Rule {
  ruleMapping: RuleMappingValue;
}

const GenericRuleInput = ({ ruleMapping }: Rule) => {
  return <pre>{JSON.stringify(ruleMapping, null, 2)}</pre>;
};

export default GenericRuleInput;
