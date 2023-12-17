import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LayoutStore {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    set => ({
      collapsed: false,
      setCollapsed: collapsed => set({ collapsed }),
    }),
    {
      name: 'layout',
    },
  ),
);
