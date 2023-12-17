'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

export default function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SessionProvider refetchWhenOffline={false}>{children}</SessionProvider>;
}
