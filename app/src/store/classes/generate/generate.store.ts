import type { UniqueIdentifier } from '@dnd-kit/core';
import type { RuleType } from '@pedaki/services/algorithms/generate_classes/input.schema';
import type { Student } from '@pedaki/services/students/student_base.model';
import { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';

export interface ClassesGenerateStore {
  studentsCount: number | null;
  setStudentsCount: (count: number) => void;

  studentData: (Student & { containerId: UniqueIdentifier; key: UniqueIdentifier })[];
  setStudentData: (studentData: ClassesGenerateStore['studentData']) => void;

  classesData: { id: UniqueIdentifier }[];
  setClassesData: (classesData: ClassesGenerateStore['classesData']) => void;

  activeCreateRule: RuleType | null;
  setActiveCreateRule: (rule: RuleType | null) => void;

  hasEdited: boolean;
  setHasEdited: (hasEdited: boolean) => void;
}

export type ClassesGenerateStoreType = ReturnType<typeof initializeStore>;

const zustandContext = createContext<ClassesGenerateStoreType | null>(null);

export const Provider = zustandContext.Provider;

export const useClassesGenerateStore = <T>(selector: (state: ClassesGenerateStore) => T) => {
  const store = useContext(zustandContext);

  if (!store) throw new Error('Store is missing the provider');

  return useZustandStore(store, selector);
};

// eslint-disable-next-line
export type InitialStore = {};

export const initializeStore = (preloadedState: InitialStore) => {
  return createStore<ClassesGenerateStore>(set => ({
    ...preloadedState,
    studentsCount: null,
    setStudentsCount: count => set({ studentsCount: count }),
    activeCreateRule: null,
    setActiveCreateRule: rule => set({ activeCreateRule: rule }),
    hasEdited: false,
    setHasEdited: hasEdited => set({ hasEdited }),
    studentData: [],
    setStudentData: studentData => set({ studentData }),
    classesData: [],
    setClassesData: classesData => set({ classesData }),
  }));
};
