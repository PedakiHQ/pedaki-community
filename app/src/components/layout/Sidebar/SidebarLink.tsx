'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@pedaki/design/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import type { IconType } from '@pedaki/design/ui/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@pedaki/design/ui/tooltip';
import { cn } from '@pedaki/design/utils';
import { useGlobalStore } from '~/store/global/global.store.ts';
import { isActive, useIsSmall } from '~/utils.ts';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import React from 'react';

interface SidebarLink {
  icon: IconType;
  title: string;
  iconClassName?: string;
}

type SidebarLinkSubItem = Omit<SidebarLink, 'icon'> & {
  href: string;
};

type SidebarLinkWithChildren = SidebarLink & {
  items: SidebarLinkSubItem[];
  href?: never;
};
type SidebarLinkWithoutChildren = SidebarLink & {
  href: string;
  items?: never;
};

export type SidebarLinkProps = SidebarLinkWithChildren | SidebarLinkWithoutChildren;

const baseItemClass =
  'flex items-center w-full gap-2 px-3 py-2 rounded-md text-sub hover:bg-white focus-ring group-data-[collapsed=true]/sidebar:sm:justify-center';
const subItemClass = (active: boolean | undefined) =>
  cn(baseItemClass, 'border text-sub', active ? 'z-[1] bg-white shadow-sm' : 'border-transparent');

const SidebarLink = ({ items, href, ...props }: SidebarLinkProps) => {
  if (items) {
    return <SidebarLinkWithChildren {...props} items={items} />;
  }
  if (href) {
    return <SidebarLinkWithoutChildren {...props} href={href} />;
  }
  return null;
};

const SidebarLinkWithChildren = ({
  icon: Icon,
  title,
  items,
  iconClassName,
}: SidebarLinkWithChildren) => {
  const segment = useSelectedLayoutSegment();
  const active = items.some(item => isActive(segment, item.href));

  return (
    <div>
      <div className="hidden group-data-[collapsed=true]/sidebar:sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus-ring w-full rounded-md">
            <SidebarMenuItem
              icon={Icon}
              title={title}
              href=""
              active={active}
              className={baseItemClass}
              iconClassName={iconClassName}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right">
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            {items.map((child, index) => {
              const href = child.href;
              const active = href.startsWith(`/${segment}`) || href === `/${segment ?? ''}`;
              return (
                <DropdownMenuItem key={index} disabled={active} asChild className="w-full">
                  <Link href={href}>{child.title}</Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="group-data-[collapsed=true]/sidebar:sm:hidden">
        <Collapsible defaultOpen={active}>
          <CollapsibleTrigger className="focus-ring w-full rounded-md">
            <SidebarMenuItem
              icon={Icon}
              title={title}
              href=""
              active={active}
              className={baseItemClass}
              iconClassName={iconClassName}
            />
          </CollapsibleTrigger>
          <CollapsibleContent animate className="p-1 pl-0">
            <ul className="flex flex-col gap-1.5 pt-1">
              {items?.map((child, index) => {
                const href = child.href;
                const active = href.startsWith(`/${segment}`) || href === `/${segment ?? ''}`;
                return (
                  <ol className="relative" key={index}>
                    <SidebarDecoration />
                    <SidebarLinkSubItem {...child} active={active} />
                  </ol>
                );
              })}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

const SidebarDecoration = () => {
  return (
    <div className="absolute inset-y-0 left-5">
      <div className="absolute h-full w-px translate-y-[-70%] scale-150 bg-soft"></div>
    </div>
  );
};

const SidebarLinkWithoutChildren = ({ href, ...props }: SidebarLinkWithoutChildren) => {
  const segment = useSelectedLayoutSegment();
  const active = href.startsWith(`/${segment}`) || href === `/${segment ?? ''}`;
  return (
    <SidebarMenuItem href={href} {...props} active={active} className={subItemClass(active)} />
  );
};

const SidebarMenuItem = ({
  href,
  icon: Icon,
  title,
  active = false,
  className,
  iconClassName,
}: SidebarLinkWithoutChildren & {
  active?: boolean;
  className: string;
}) => {
  const setMobileOpen = useGlobalStore(state => state.setMobileOpen);
  const Component = href ? Link : 'div';
  const isSmall = useIsSmall();
  const collapsed = useGlobalStore(state => state.collapsed);

  return (
    <Tooltip open={collapsed && !isSmall ? undefined : false}>
      <TooltipTrigger asChild>
        <Component
          href={href}
          className={cn(className, 'group')}
          onClick={() => href && setMobileOpen?.(false)}
        >
          <div className="flex h-5 w-5 items-center justify-center">
            <Icon className={cn('h-5 w-5', active && 'text-primary-base', iconClassName)} />
          </div>
          <span
            className={cn(
              'text-label-sm font-medium group-data-[collapsed=true]/sidebar:sm:hidden',
              active && 'text-main',
            )}
          >
            {title}
          </span>
        </Component>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        <p>
          {/*TODO translate*/}
          {title}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

const SidebarLinkSubItem = ({ href, title, active }: SidebarLinkSubItem & { active?: boolean }) => {
  const setMobileOpen = useGlobalStore(state => state.setMobileOpen);

  return (
    <div className="pl-7">
      <Link href={href} className={cn(subItemClass(active))} onClick={() => setMobileOpen?.(false)}>
        <span className={cn('text-label-sm font-medium', active && 'text-main')}>{title}</span>
      </Link>
    </div>
  );
};

export default SidebarLink;
