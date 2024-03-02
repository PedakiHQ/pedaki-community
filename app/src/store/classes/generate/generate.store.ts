import type { UniqueIdentifier } from '@dnd-kit/core';
import { randomId } from '@pedaki/common/utils/random.js';
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
  return createStore<ClassesGenerateStore>((set, get) => ({
    ...preloadedState,
    studentsCount: null,
    setStudentsCount: count => set({ studentsCount: count }),
    activeCreateRule: null,
    setActiveCreateRule: rule => set({ activeCreateRule: rule }),
    hasEdited: false,
    setHasEdited: hasEdited => set({ hasEdited }),
    studentData: [],
    setStudentData: studentData => {
      const containers = get().classesData;
      // let finalClassesData = classesData;
      const containerWithNoItems = containers.filter(
        container => !studentData.some(student => student.containerId === container.id),
      );
      if (containers.length != 0 && containerWithNoItems.length === 0) {
        // add container
        const newContainer = { id: randomId() };
        set({ classesData: [...containers, newContainer] });
      } else if (containerWithNoItems.length > 1) {
        // remove container
        // keep only the first container
        const noItemsId = containerWithNoItems[0]!.id;
        const filteredContainers = containers.filter(container => container.id !== noItemsId);
        console.log({ filteredContainers });
        set({ classesData: filteredContainers });
      }
      set({ studentData });
    },
    classesData: [],
    setClassesData: classesData => set({ classesData }),
  }));
};
