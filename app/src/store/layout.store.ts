import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export interface LayoutStore {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export const useLayoutStore = create<LayoutStore>()(
    persist(
        (set, get) => ({
            collapsed: false,
            setCollapsed: collapsed => set({collapsed}),
        }),
        {
            name: 'layout',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
