import type { RawAttribute, RawRule, RuleType } from '@pedaki/algorithms/input';
import { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';

export interface GenerateClassesRulesStore {
  newRule: (type: RuleType) => void;
  setAttribute: (ruleIndex: number, attributeIndex: number, attribute: RawAttribute) => void;
  setAttributes: (ruleIndex: number, attributes: RawAttribute[]) => void;
  deleteRule: (position: number) => void;
  rules: RawRule[];
}

export type GenerateClassesRulesStoreType = ReturnType<typeof initializeStore>;

const zustandContext = createContext<GenerateClassesRulesStoreType | null>(null);

export const Provider = zustandContext.Provider;

export const useGenerateClassesRulesStore = <T>(
  selector: (state: GenerateClassesRulesStore) => T,
) => {
  const store = useContext(zustandContext);

  if (!store) throw new Error('Store is missing the provider');

  return useZustandStore(store, selector);
};

export const initializeStore = () => {
  return createStore<GenerateClassesRulesStore>(set => ({
    rules: [],
    newRule: (ruleType: RuleType) =>
      set(state => ({
        rules: state.rules.concat({
          rule: ruleType,
          attributes: [],
        } as RawRule),
      })),
    deleteRule: (position: number) =>
      set(state => ({
        rules: state.rules
          .slice(0, position)
          .concat(...state.rules.slice(position + 1, state.rules.length)),
      })),
    setAttribute: (ruleIndex, attributeIndex, attribute) =>
      set(state => {
        const rule = state.rules[ruleIndex];
        if (!rule) return state;
        if (attributeIndex == rule.attributes.length) rule.attributes.push(attribute);
        else rule.attributes[attributeIndex] = attribute;
        // TODO
        return {
          rules: state.rules
            .slice(0, ruleIndex)
            .concat(Object.assign({}, rule))
            .concat(...state.rules.slice(ruleIndex + 1, state.rules.length)),
        };
      }),
    setAttributes: (ruleIndex, attributes) =>
      set(state => {
        const rule = state.rules[ruleIndex];
        if (!rule) return state;
        rule.attributes = attributes
        return {
          rules: state.rules
            .slice(0, ruleIndex)
            .concat(Object.assign({}, rule))
            .concat(...state.rules.slice(ruleIndex + 1, state.rules.length)),
        };
      })
  }));
};
