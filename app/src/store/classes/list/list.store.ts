import type { ClassColumnDef } from '~/components/classes/list/columns.tsx';
import type { OutputType } from '~api/router/router.ts';
import { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';

export interface ClassesListStore {
  translatedColumns: ClassColumnDef[];
  teacherMapping: OutputType['teachers']['getMany'];
  academicYearMapping: OutputType['academicYear']['getMany'];
  classBranchMapping: OutputType['classes']['branches']['getMany'];
  classLevelMapping: OutputType['classes']['levels']['getMany'];
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

type InitialStore = Pick<
  ClassesListStore,
  'teacherMapping' | 'academicYearMapping' | 'classBranchMapping' | 'classLevelMapping'
>;

export const initializeStore = (preloadedState: InitialStore) => {
  return createStore<ClassesListStore>(set => ({
    ...preloadedState,
    translatedColumns: [],
    setTranslatedColumns: columns => set({ translatedColumns: columns }),
  }));
};
