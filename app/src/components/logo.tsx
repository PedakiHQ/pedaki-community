import { cn } from '@pedaki/design/utils';
import { LOGO_URL } from '~/constants.ts';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Logo: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ className }) => {
  return (
    <Link className={cn('flex select-none items-center hover:opacity-75', className)} href="/">
      <Image src={LOGO_URL} alt="Pedaki" height={180} width={180} fetchPriority="high" />
    </Link>
  );
};

export default Logo;
