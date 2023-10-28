'use client';

import React from 'react';
import { TrpcProvider } from '../server/providers';

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
