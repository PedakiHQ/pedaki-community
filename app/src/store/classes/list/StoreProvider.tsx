'use client';

import type { ClassesListStore, ClassesListStoreType } from '~/store/classes/list/list.store.ts';
import { initializeStore, Provider } from '~/store/classes/list/list.store.ts';
import type { PropsWithChildren } from 'react';
import React, { useRef } from 'react';

const StoreProvider = ({
  children,
  ...props
}: PropsWithChildren & Omit<ClassesListStore, 'translatedColumns' | 'setTranslatedColumns'>) => {
  // TODO: faire un meilleur type
  const storeRef = useRef<ClassesListStoreType>();

  if (!storeRef.current) {
    storeRef.current = initializeStore(props);
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
