import type { OutputType } from '~api/router/router.ts';
import { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';

type Settings = OutputType['settings']['getSettings'];

export interface WorkspaceStore {
  settings: Settings;
  updateSetting: <T extends keyof Settings>(key: T, value: Settings[T]) => void;
}

export type WorkspaceStoreType = ReturnType<typeof initializeStore>;

const zustandContext = createContext<WorkspaceStoreType | null>(null);

export const Provider = zustandContext.Provider;

export const useWorkspaceStore = <T>(selector: (state: WorkspaceStore) => T) => {
  const store = useContext(zustandContext);

  if (!store) throw new Error('Store is missing the provider');

  return useZustandStore(store, selector);
};

export const initializeStore = (preloadedState: Pick<WorkspaceStore, 'settings'>) => {
  return createStore<WorkspaceStore>((set, get) => ({
    ...preloadedState,
    updateSetting: (key, value) => {
      set({
        settings: {
          ...get().settings,
          [key]: value,
        },
      }); // TODO faire mieuw les copies c'est apas bien
    },
  }));
};
