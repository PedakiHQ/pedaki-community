'use client';

import { TrpcProvider } from '~/server/provider.tsx';
import React from 'react';
import { Toaster } from 'sonner';

interface Props {
  children: (React.ReactElement | React.ReactNode) | (React.ReactElement | React.ReactNode)[];
}

export const BaseProvider = ({ children }: Props) => {
  return (
    <>
      <Toaster />
      <TrpcProvider>{children}</TrpcProvider>
    </>
  );
};
