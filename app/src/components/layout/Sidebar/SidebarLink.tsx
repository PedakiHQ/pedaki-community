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
import { useIsSmall } from '~/utils.ts';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import React from 'react';

interface SidebarLink {
  icon: IconType;
  title: string;
  segment: string | undefined;
  iconClassName?: string;
  id?: string;
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

const SidebarLinkWithChildren = ({ items, segment, ...props }: SidebarLinkWithChildren) => {
  const segments = useSelectedLayoutSegments();
  const currentSegmentIndex = segment ? segments.indexOf(segment) : -1;
  const active = currentSegmentIndex !== -1;

  return (
    <div>
      <div className="hidden group-data-[collapsed=true]/sidebar:sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus-ring w-full rounded-md">
            <SidebarMenuItem
              href=""
              active={active}
              className={baseItemClass}
              segment={segment}
              {...props}
              id={`${props.id}-dropdown`}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right">
            <DropdownMenuLabel>{props.title}</DropdownMenuLabel>
            {items.map((child, index) => {
              const childSegmentIndex = child.segment ? segments.indexOf(child.segment) : -1;
              const active =
                childSegmentIndex !== -1 && childSegmentIndex === currentSegmentIndex + 1;
              return (
                <DropdownMenuItem key={index} disabled={active} asChild className="w-full">
                  <Link href={child.href}>{child.title}</Link>
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
              href=""
              active={active}
              className={baseItemClass}
              segment={segment}
              {...props}
            />
          </CollapsibleTrigger>
          <CollapsibleContent animate className="p-1 pl-0">
            <ul className="flex flex-col gap-1.5 pt-1">
              {items?.map(child => {
                const childSegmentIndex = child.segment ? segments.indexOf(child.segment) : -1;
                const active =
                  childSegmentIndex !== -1 && childSegmentIndex === currentSegmentIndex + 1;
                return (
                  <ol className="relative" key={child.segment}>
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

const SidebarLinkWithoutChildren = ({ href, segment, ...props }: SidebarLinkWithoutChildren) => {
  const segments = useSelectedLayoutSegments();
  const currentSegmentIndex = segment ? segments.indexOf(segment) : -1;
  const active = currentSegmentIndex !== -1 || (segments.length === 0 && segment === undefined);

  return (
    <SidebarMenuItem
      href={href}
      {...props}
      active={active}
      segment={segment}
      className={subItemClass(active)}
    />
  );
};

const SidebarMenuItem = ({
  href,
  icon: Icon,
  title,
  active = false,
  className,
  iconClassName,
  ...props
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
          id={props.id}
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
        <p>{title}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const SidebarLinkSubItem = ({
  href,
  title,
  active,
  id,
}: SidebarLinkSubItem & { active?: boolean }) => {
  const setMobileOpen = useGlobalStore(state => state.setMobileOpen);
  console.log('id', id);

  return (
    <div className="pl-7" id={id}>
      <Link href={href} className={cn(subItemClass(active))} onClick={() => setMobileOpen?.(false)}>
        <span className={cn('text-label-sm font-medium', active && 'text-main')}>{title}</span>
      </Link>
    </div>
  );
};

export default SidebarLink;
