"use client";

import type {IconType} from '@pedaki/design/ui/icons';
import {cn} from '@pedaki/design/utils';
import Link from 'next/link';
import React from 'react';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@pedaki/design/ui/collapsible";
import {useSelectedLayoutSegment} from 'next/navigation';
import {Tooltip, TooltipContent, TooltipTrigger} from '@pedaki/design/ui/tooltip';
import {useLayoutStore} from "~/store/layout.store.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuTrigger
} from "@pedaki/design/ui/dropdown-menu";


interface SidebarLink {
    icon: IconType;
    title: string;
}

type SidebarLinkSubItem = Omit<SidebarLink, 'icon'> & {
    href: string;
}

type SidebarLinkWithChildren = SidebarLink & {
    items: SidebarLinkSubItem[];
    href?: never;
}
type SidebarLinkWithoutChildren = SidebarLink & {
    href: string;
    items?: never;
}

export type SidebarLinkProps = SidebarLinkWithChildren | SidebarLinkWithoutChildren;


const baseItemClass = 'flex items-center w-full gap-2 px-3 py-2 rounded-md text-sub hover:bg-white focus-ring';
const subItemClass = (active: boolean | undefined) => cn(baseItemClass, 'border text-sub', active ? 'bg-white shadow-sm z-[1]' : 'border-transparent')

const SidebarLink = ({items, href, ...props}: SidebarLinkProps) => {
    if (items) {
        return <SidebarLinkWithChildren {...props} items={items}/>
    }
    if (href) {
        return <SidebarLinkWithoutChildren {...props} href={href}/>
    }
    return null;
};

const SidebarLinkWithChildren = ({icon: Icon, title, items}: SidebarLinkWithChildren) => {
    const segment = useSelectedLayoutSegment();
    const active = items?.some(item => item.href.startsWith(`/${segment}`) || item.href === `/${segment ?? ''}`);

    const collapsed = useLayoutStore(state => state.collapsed);
    if (collapsed) {
        return (
            <DropdownMenu >
                <DropdownMenuTrigger className="w-full focus-ring">
                    <SidebarMenuItem icon={Icon} title={title} href="" active={active} className={baseItemClass}/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="right">
                    <DropdownMenuLabel>
                        {title}
                    </DropdownMenuLabel>
                    {items?.map((child, index) => {
                        const href = child.href;
                        const active = href.startsWith(`/${segment}`) || href === `/${segment ?? ''}`;
                        return (
                            <DropdownMenuItem key={index} disabled={active}>
                                {child.title}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }


    return (
        <Collapsible defaultOpen={active}>
            <CollapsibleTrigger className="w-full focus-ring">
                <SidebarMenuItem icon={Icon} title={title} href="" active={active} className={baseItemClass}/>
            </CollapsibleTrigger>
            <CollapsibleContent animate>
                <ul className="flex flex-col gap-1 pt-1">
                    {items?.map((child, index) => {
                        const href = child.href;
                        const active = href.startsWith(`/${segment}`) || href === `/${segment ?? ''}`;
                        return (
                            <ol className="relative" key={index}>
                                <SidebarDecoration/>
                                <SidebarLinkSubItem  {...child} active={active}/>
                            </ol>
                        );
                    })}
                </ul>
            </CollapsibleContent>
        </Collapsible>
    );
}

const SidebarDecoration = () => {
    return (
        <div className='absolute inset-y-0 left-5'>
            <div className="absolute w-px h-full bg-soft -translate-y-1/3 scale-110"></div>
        </div>
    )
}

const SidebarLinkWithoutChildren = ({href, ...props}: SidebarLinkWithoutChildren) => {
    const segment = useSelectedLayoutSegment();
    const active = href.startsWith(`/${segment}`) || href === `/${segment ?? ''}`;
    return (
        <SidebarMenuItem href={href} {...props} active={active} className={subItemClass(active)}/>
    );
}

const SidebarMenuItem = ({href, icon: Icon, title, active = false, className, onClick}: SidebarLinkWithoutChildren & {
    active?: boolean,
    className: string
    onClick?: () => void
}) => {
    const Component = href ? Link : 'div';

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Component href={href}
                           className={cn(className, 'group')}
                           onClick={onClick}>
                    <Icon className={cn("w-5 h-5", active && 'text-primary-base')}/>
                    <span
                        className={cn("text-label-sm font-medium group-data-[collapsed=true]/sidebar:hidden", active && "text-main")}>{title}</span>
                </Component>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
                <p>
                    {/*TODO translate*/}
                    {title}
                </p>
            </TooltipContent>
        </Tooltip>
    )
}

const SidebarLinkSubItem = ({href, title, active}: SidebarLinkSubItem & { active?: boolean }) => {
    return (
        <div className="pl-7">
            <Link href={href}
                  className={cn(subItemClass(active))}
                  tabIndex={2}
            >
                <span className={cn("text-label-sm font-medium", active && "text-main")}>{title}</span>
            </Link>
        </div>
    );
}

export default SidebarLink;
