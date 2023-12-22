'use client';

import type { WorkspaceStore, WorkspaceStoreType } from '~/store/workspace/workspace.store.ts';
import { initializeStore, Provider } from '~/store/workspace/workspace.store.ts';
import type { PropsWithChildren } from 'react';
import React, { useRef } from 'react';

const StoreProvider = ({
  children,
  ...props
}: PropsWithChildren & Pick<WorkspaceStore, 'settings'>) => {
  // TODO: faire un meilleur type
  const storeRef = useRef<WorkspaceStoreType>();

  if (!storeRef.current) {
    storeRef.current = initializeStore(props);
    console.log({ props });
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
