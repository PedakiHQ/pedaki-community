'use client';

import { TrpcProvider } from '~/server/provider.tsx';
import React from 'react';

interface Props {
  children: any; // TODO: type
}

export const Providers = ({ children }: Props) => {
  return (
    <>
      <TrpcProvider>{children}</TrpcProvider>
    </>
  );
};
