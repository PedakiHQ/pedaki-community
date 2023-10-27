'use client';

import { api } from '../utils/trpc';
import type React from 'react';

export const TrpcProvider = api.withTRPC(
  (props: React.PropsWithChildren) => props.children
) as React.ComponentType<React.PropsWithChildren>;
