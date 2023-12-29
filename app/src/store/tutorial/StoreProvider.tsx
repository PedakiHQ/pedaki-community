'use client';

import type { TutorialStore, TutorialStoreType } from '~/store/tutorial/tutorial.store.ts';
import { initializeStore, Provider } from '~/store/tutorial/tutorial.store.ts';
import type { PropsWithChildren } from 'react';
import React, { useRef } from 'react';

const StoreProvider = ({ children, ...props }: PropsWithChildren & Partial<TutorialStore>) => {
  const storeRef = useRef<TutorialStoreType>();

  if (!storeRef.current) {
    storeRef.current = initializeStore(props);
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
