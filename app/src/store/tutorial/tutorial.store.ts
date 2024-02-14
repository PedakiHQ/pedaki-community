import type { Tutorial } from '~/store/tutorial/type.ts';
import { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';

export interface TutorialStore {
  paused: boolean;
  setPaused: (paused: boolean) => void;

  stepIndex: number;
  setStepIndex: (stepIndex: number) => void;
  setNextStep: () => void;

  tutorial: Tutorial | null; // started if not null
  setTutorial: (tutorial: Tutorial | null) => void;

  completed: string[]; // TODO: This is not used yet, but I think we can load ids from the db to prevent showing the tutorial again
  addCompleted: (id: string) => void;
  setCompleted: (ids: string[]) => void;
}

export type TutorialStoreType = ReturnType<typeof initializeStore>;

const zustandContext = createContext<TutorialStoreType | null>(null);

export const Provider = zustandContext.Provider;

export const useTutorialStore = <T>(selector: (state: TutorialStore) => T) => {
  const store = useContext(zustandContext);

  if (!store) throw new Error('Store is missing the provider');

  return useZustandStore(store, selector);
};

export const initializeStore = (preloadedState: Partial<TutorialStore> = {}) => {
  return createStore<TutorialStore>((set, get) => ({
    paused: false,
    stepIndex: 0,
    tutorial: null,
    completed: [],
    ...preloadedState,
    setPaused: (paused: boolean) => set({ paused }),
    setStepIndex: (stepIndex: number) => set({ stepIndex }),
    setNextStep: () => set({ stepIndex: get().stepIndex + 1 }),
    setTutorial: (tutorial: Tutorial | null) => set({ tutorial, stepIndex: 0, paused: false }),
    addCompleted: (id: string) => set({ completed: [...get().completed, id] }),
    setCompleted: (ids: string[]) => set({ completed: ids }),
  }));
};
