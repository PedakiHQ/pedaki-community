import { cn } from '@pedaki/design/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// TODO: load custom logo from db

const Logo: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ className }) => {
  return (
    <Link className={cn('flex select-none items-center hover:opacity-75', className)} href="/">
      <Image
        src="https://static.pedaki.fr/logo/apple-touch-icon.png"
        alt="Pedaki"
        height={180}
        width={180}
      />
    </Link>
  );
};

export default Logo;
