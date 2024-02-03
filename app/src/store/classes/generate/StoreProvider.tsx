'use client';

import { initializeStore, Provider } from '~/store/classes/generate/rules.store.ts';
import type { GenerateClassesRulesStoreType } from '~/store/classes/generate/rules.store.ts';
import type { PropsWithChildren } from 'react';
import React, { useRef } from 'react';

const StoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<GenerateClassesRulesStoreType>();

  if (!storeRef.current) {
    storeRef.current = initializeStore();
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
