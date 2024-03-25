import type { UniqueIdentifier } from '@dnd-kit/core';
import { hashCode } from '@pedaki/common/utils/hash';
import { randomId } from '@pedaki/common/utils/random.js';
import type { RuleType } from '@pedaki/services/algorithms/generate_classes/input.schema';
import type { Student } from '@pedaki/services/students/student_base.model';
import { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';

export interface ClassesGenerateStore {
  studentsCount: number | null;
  setStudentsCount: (count: number) => void;

  studentData: (Student & { containerId: string; key: UniqueIdentifier })[];
  setStudentData: (studentData: ClassesGenerateStore['studentData']) => void;

  classesData: { id: string }[];
  setClassesData: (classesData: ClassesGenerateStore['classesData']) => void;

  activeCreateRule: RuleType | null;
  setActiveCreateRule: (rule: RuleType | null) => void;

  hasEdited: boolean;
  setHasEdited: (hasEdited: boolean) => void;

  displayColumn: keyof Student;
  setDisplayColumn: (displayColumn: keyof Student) => void;

  displayColumnValues: any[] | null; // null if too many values
  generateDisplayColumnValues: () => void;
  getColorForStudent: (student: Student) => string;
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
    displayColumn: 'firstName',
    setDisplayColumn: displayColumn => {
      set({ displayColumn });
      get().generateDisplayColumnValues();
    },
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
        set({ classesData: filteredContainers });
      }
      set({ studentData });
      get().generateDisplayColumnValues();
    },
    classesData: [],
    setClassesData: classesData => set({ classesData }),
    displayColumnValues: null,
    generateDisplayColumnValues: () => {
      const displayColumn = get().displayColumn;

      const displayColumnValues = (() => {
        switch (displayColumn) {
          case 'firstName':
            return null;
          case 'birthDate': {
            // count of years
            const yearsValues = get().studentData.map(student => student.birthDate.getFullYear());
            return [...new Set(yearsValues)];
          }
          case 'gender': {
            const genderValues = get().studentData.map(student => student.gender);
            return [...new Set(genderValues)];
          }
          default:
            if (displayColumn.startsWith('properties.')) {
              // TODO: depends on the type of the property
              return new Array(21).fill(0).map((_, i) => i);
            }
            return null;
        }
      })();

      set({ displayColumnValues });
    },
    getColorForStudent: student => {
      const colorsCount = get().displayColumnValues;
      const displayColumn = get().displayColumn;
      let hue;
      if (colorsCount === null) {
        const nameKey =
          displayColumn === 'firstName' ? student.firstName + student.lastName : displayColumn;
        const nameHash = hashCode(nameKey);
        hue = nameHash % 360;
      } else {
        let index: number;
        if (displayColumn.startsWith('properties.')) {
          const id = displayColumn.split('.', 2)[1]!;
          const value = student.properties?.[id] ?? null;
          index = value ? colorsCount.indexOf(value) : 0;
        } else if (displayColumn === 'birthDate') {
          const year = student.birthDate.getFullYear();
          index = colorsCount.indexOf(year);
        } else {
          index = colorsCount.indexOf(student[displayColumn]);
        }
        if (index === -1) {
          return 'transparent';
        }

        const percent = index / (colorsCount.length - 1);
        hue = 240 - ((1 - percent) * 240);

        // TODO: add color filter = bad -> red, good -> green. No inbetween
      }

      const hsl = `hsl(${hue}, 85%, 90%)`;
      return hsl;
    },
  }));
};
