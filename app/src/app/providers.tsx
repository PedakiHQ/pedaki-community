'use client';

import { TrpcProvider } from '~/server/providers';
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
