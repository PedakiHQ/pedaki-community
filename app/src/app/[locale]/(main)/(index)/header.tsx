'use client';

import { Skeleton } from '@pedaki/design/ui/skeleton';
import PageHeader from '~/components/PageHeader.tsx';
import { useSession } from 'next-auth/react';
import React from 'react';

interface HeaderProps {
  description: string;
}

const Header = ({ description }: HeaderProps) => {
  const { data } = useSession();
  // const t = useScopedI18n('main.layout.sidebar.user');

  return (
    <PageHeader
      image={data?.user.image ?? ''}
      title={!data ? <Skeleton className="w-64">&nbsp;</Skeleton> : `t(...) ${data.user.name} !`}
      description={description}
    />
  );
};

export default Header;
