'use client';

import type { GlobalStore, GlobalStoreType } from '~/store/global/global.store.ts';
import { initializeStore, Provider } from '~/store/global/global.store.ts';
import type { PropsWithChildren } from 'react';
import React, { useRef } from 'react';

const StoreProvider = ({ children, ...props }: PropsWithChildren & Partial<GlobalStore>) => {
  const storeRef = useRef<GlobalStoreType>();

  if (!storeRef.current) {
    storeRef.current = initializeStore(props);
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
