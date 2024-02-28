'use client';

import type {
  ClassesGenerateStoreType,
  InitialStore,
} from '~/store/classes/generate/generate.store.ts';
import { initializeStore, Provider } from '~/store/classes/generate/generate.store.ts';
import type { PropsWithChildren } from 'react';
import React, { useRef } from 'react';

const StoreProvider = ({ children, ...props }: PropsWithChildren & InitialStore) => {
  const storeRef = useRef<ClassesGenerateStoreType>();

  if (!storeRef.current) {
    storeRef.current = initializeStore(props);
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
