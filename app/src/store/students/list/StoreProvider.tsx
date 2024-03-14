'use client';

import type { InitializeStoreProps, StudentsListStoreType } from '~/store/students/list/list.store.ts';
import { initializeStore, Provider } from '~/store/students/list/list.store.ts';
import type { PropsWithChildren } from 'react';
import React, { useRef } from 'react';

const StoreProvider = ({
  children,
  ...props
}: PropsWithChildren & InitializeStoreProps) => {
  // TODO: faire un meilleur type
  const storeRef = useRef<StudentsListStoreType>();

  if (!storeRef.current) {
    storeRef.current = initializeStore(props);
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
