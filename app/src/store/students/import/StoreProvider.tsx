'use client';

import type {
  StudentsImportStore,
  StudentsImportStoreType,
} from '~/store/students/import/import.store.ts';
import { initializeStore, Provider } from '~/store/students/import/import.store.ts';
import type { PropsWithChildren } from 'react';
import React, { useRef } from 'react';

const StoreProvider = ({
  children,
  ...props
}: PropsWithChildren &
  Omit<
    StudentsImportStore,
    'setSelectorVisible' | 'selectorVisible' | 'nextId' | 'setNextId' | 'items' | 'setItems'
  >) => {
  // TODO: faire un meilleur type
  const storeRef = useRef<StudentsImportStoreType>();

  if (!storeRef.current) {
    storeRef.current = initializeStore(props);
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
