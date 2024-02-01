import type { Field, FieldType } from '@pedaki/services/classes/query.model';
import type { ClassColumnDef } from '~/components/classes/list/columns.tsx';
import type { OutputType } from '~api/router/router.ts';
import { createContext, useContext } from 'react';
import type { z } from 'zod';
import { createStore, useStore as useZustandStore } from 'zustand';

export interface ClassesListStore {
  translatedColumns: ClassColumnDef[];
  teacherMapping: OutputType['teachers']['getMany'];
  setTranslatedColumns: (columns: ClassColumnDef[]) => void;
}

export type ClassesListStoreType = ReturnType<typeof initializeStore>;

const zustandContext = createContext<ClassesListStoreType | null>(null);

export const Provider = zustandContext.Provider;

export const useClassesListStore = <T>(selector: (state: ClassesListStore) => T) => {
  const store = useContext(zustandContext);

  if (!store) throw new Error('Store is missing the provider');

  return useZustandStore(store, selector);
};

export const initializeStore = (
  preloadedState: Omit<
    ClassesListStore,
    'translatedColumns' | 'propertySchemaMapping' | 'setTranslatedColumns'
  >,
) => {
  return createStore<ClassesListStore>(set => ({
    ...preloadedState,
    translatedColumns: [],
    setTranslatedColumns: columns => set({ translatedColumns: columns }),
  }));
};
