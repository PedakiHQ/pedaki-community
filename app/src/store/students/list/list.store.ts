import { PROPERTIES_VALIDATION } from '@pedaki/services/students/properties/properties-validations.js';
import type { Field } from '@pedaki/services/students/query.model';
import type { FieldType } from '@pedaki/services/utils/query';
import type { StudentColumnDef } from '~/components/students/list/columns.tsx';
import type { OutputType } from '~api/router/router.ts';
import { createContext, useContext } from 'react';
import type { z } from 'zod';
import { createStore, useStore as useZustandStore } from 'zustand';

export interface StudentsListStore {
  translatedColumns: StudentColumnDef[];
  propertyMapping: OutputType['students']['properties']['getMany'];
  propertySchemaMapping: Record<Field, { type: FieldType; schema: z.Schema }>;
  classMapping: OutputType['classes']['getMany'];
  teacherMapping: OutputType['teachers']['getMany'];
  setTranslatedColumns: (columns: StudentColumnDef[]) => void;
}

export type StudentsListStoreType = ReturnType<typeof initializeStore>;

const zustandContext = createContext<StudentsListStoreType | null>(null);

export const Provider = zustandContext.Provider;

export const useStudentsListStore = <T>(selector: (state: StudentsListStore) => T) => {
  const store = useContext(zustandContext);

  if (!store) throw new Error('Store is missing the provider');

  return useZustandStore(store, selector);
};

export type InitializeStoreProps = Omit<
  StudentsListStore,
  'translatedColumns' | 'propertySchemaMapping' | 'setTranslatedColumns'
>;

export const initializeStore = (preloadedState: InitializeStoreProps) => {
  return createStore<StudentsListStore>(set => ({
    ...preloadedState,
    propertySchemaMapping: Object.entries(preloadedState.propertyMapping).reduce(
      (acc, [key, value]) => {
        acc[`properties.${key}`] = PROPERTIES_VALIDATION[value.type];
        return acc;
      },
      {} as StudentsListStore['propertySchemaMapping'],
    ),
    translatedColumns: [],
    setTranslatedColumns: columns => set({ translatedColumns: columns }),
  }));
};
