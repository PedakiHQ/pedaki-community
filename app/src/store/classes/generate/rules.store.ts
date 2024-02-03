import type { RawRule, RuleType } from '@pedaki/algorithms/input';
import { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';

export interface GenerateClassesRulesStore {
  newRule: (type: RuleType) => void;
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
          priority: state.rules.length,
          attributes: [],
        } as RawRule),
      })),
    deleteRule: (position: number) =>
      set(state => ({
        rules: state.rules
          .slice(0, position)
          .concat(...state.rules.slice(position + 1, state.rules.length)),
      })),
  }));
};
