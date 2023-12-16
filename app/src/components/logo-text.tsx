import { cn } from '@pedaki/design/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// TODO: load custom logo from db

const LogoText: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 120, height = 36, className }) => {
  return (
    <Link className={cn('flex select-none items-center hover:opacity-75', className)} href="/">
      <Image
        src="https://static.pedaki.fr/logo/logo-light.svg"
        alt="Pedaki"
        height={height}
        width={width}
        className="inline dark:hidden"
      />
      <Image
        src="https://static.pedaki.fr/logo/logo-dark.svg"
        alt="Pedaki"
        height={height}
        width={width}
        className="hidden dark:inline"
      />
    </Link>
  );
};

export default LogoText;
