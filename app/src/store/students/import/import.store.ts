import type { OutputType } from '~api/router/router.ts';
import { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';

export interface StudentsImportStore {
  classMapping: OutputType['classes']['getMany'];
  levelMapping: OutputType['classes']['levels']['getMany'];
  importId: string;
  selectorVisible: boolean;
  setSelectorVisible: (visible: boolean) => void;
  items: ({
    id: number;
    status: string;
  } & Record<string, unknown>)[];
  setItems: (items: StudentsImportStore['items']) => void;
}

export type StudentsImportStoreType = ReturnType<typeof initializeStore>;

const zustandContext = createContext<StudentsImportStoreType | null>(null);

export const Provider = zustandContext.Provider;

export const useStudentsImportStore = <T>(selector: (state: StudentsImportStore) => T) => {
  const store = useContext(zustandContext);

  if (!store) throw new Error('Store is missing the provider');

  return useZustandStore(store, selector);
};

export const initializeStore = (
  preloadedState: Omit<
    StudentsImportStore,
    'setSelectorVisible' | 'selectorVisible' | 'nextId' | 'setNextId' | 'setItems'
  >,
) => {
  return createStore<StudentsImportStore>(set => ({
    ...preloadedState,
    selectorVisible: true,
    setItems: items => set({ items }),
    setSelectorVisible: visible => set({ selectorVisible: visible }),
  }));
};
