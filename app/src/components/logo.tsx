'use client';

import { cn } from '@pedaki/design/utils';
import { useWorkspaceStore } from '~/store/workspace/workspace.store.ts';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Logo: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ className }) => {
  const logoUrl = useWorkspaceStore(state => state.logoUrl);

  return (
    <Link className={cn('flex select-none items-center hover:opacity-75', className)} href="/">
      <Image src={logoUrl} alt="Pedaki" height={180} width={180} fetchPriority="high" unoptimized />
    </Link>
  );
};

export default Logo;
