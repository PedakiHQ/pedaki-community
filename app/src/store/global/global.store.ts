import { env } from '~/env.ts';
import { COOKIE_NAME } from '~/store/global/constants.ts';
import { setCookie } from 'cookies-next';
import { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';

export interface GlobalStore {
  demoBannerVisible: boolean;
  setDemoBannerVisible: (visible: boolean) => void;
  mobileOpen: boolean;
  collapsed: boolean;
  setMobileOpen: (collapsed: boolean) => void;
  setCollapsed: (collapsed: boolean) => void;
}

export type GlobalStoreType = ReturnType<typeof initializeStore>;

const zustandContext = createContext<GlobalStoreType | null>(null);

export const Provider = zustandContext.Provider;

export const useGlobalStore = <T>(selector: (state: GlobalStore) => T) => {
  const store = useContext(zustandContext);

  if (!store) throw new Error('Store is missing the provider');

  return useZustandStore(store, selector);
};

const writeCookie = (state: GlobalStore) => {
  setCookie(COOKIE_NAME, {
    collapsed: state.collapsed,
  } satisfies Partial<GlobalStore>);
};

export const initializeStore = (preloadedState: Partial<GlobalStore> = {}) => {
  return createStore<GlobalStore>((set, get) => ({
    collapsed: false,
    mobileOpen: false,
    demoBannerVisible: env.NEXT_PUBLIC_IS_DEMO,
    ...preloadedState,
    setCollapsed: (collapsed: boolean) => {
      set({ collapsed });
      writeCookie(get());
    },
    setMobileOpen: (mobileOpen: boolean) => {
      set({ mobileOpen });
    },
    setDemoBannerVisible: (demoBannerVisible: boolean) => {
      set({ demoBannerVisible });
    },
  }));
};
