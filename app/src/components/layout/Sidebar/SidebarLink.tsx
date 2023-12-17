import type { IconType } from '@pedaki/design/ui/icons';
import { cn } from '@pedaki/design/utils';
import React from 'react';

interface SidebarLink {
  href: string;
  icon: IconType;
  title: string;
  active?: boolean;
}

type SidebarLinkProps = SidebarLink & {
  children: SidebarLink[];
};

const SidebarLink = ({ href, icon, title, active = false, children }: SidebarLinkProps) => {
  return <div className={cn('flex gap-2 px-3 py-2', active ? 'bg-weak' : 'hover:bg-weak')}></div>;
};

export default SidebarLink;
