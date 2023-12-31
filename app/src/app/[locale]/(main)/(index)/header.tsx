'use client';

import { Skeleton } from '@pedaki/design/ui/skeleton';
import PageHeader from '~/components/PageHeader.tsx';
import { useScopedI18n } from '~/locales/client';
import { useSession } from 'next-auth/react';
import React from 'react';

interface HeaderProps {
  description: string;
}

const Header = ({ description }: HeaderProps) => {
  const { data } = useSession();
  const t = useScopedI18n('main.layout.sidebar.user.header');

  return (
    <PageHeader
      image={data?.user.image ?? ''}
      title={
        !data ? <Skeleton className="w-64">&nbsp;</Skeleton> : t('name', { name: data.user.name })
      }
      description={description}
    />
  );
};

export default Header;
