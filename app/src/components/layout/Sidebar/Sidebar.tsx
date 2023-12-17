'use client';

import {cn} from '@pedaki/design/utils';
import SidebarContent from '~/components/layout/Sidebar/SidebarContent.tsx';
import SidebarFooter from '~/components/layout/Sidebar/SidebarFooter.tsx';
import SidebarHeader from '~/components/layout/Sidebar/SidebarHeader.tsx';
import {useLayoutStore} from '~/store/layout.store.ts';
import React from 'react';
import SidebarAltContent from "~/components/layout/Sidebar/SidebarAltContent.tsx";
import {TooltipProvider} from "@pedaki/design/ui/tooltip";

const Sidebar = () => {
    const collapsed = useLayoutStore(state => state.collapsed);
    const setCollapsed = useLayoutStore(state => state.setCollapsed);

    return (
        <aside
            className={cn(
                'fixed inset-y-0 left-0',
                'peer shrink-0',
                collapsed ? 'w-20' : 'w-[17rem]',
                'group/sidebar',
            )}
            data-collapsed={collapsed}
        >
            <div className="relative flex h-full w-full flex-col p-4 gap-4">
                <TooltipProvider>
                    <SidebarHeader setCollapsed={setCollapsed} collapsed={collapsed}/>
                    <SidebarContent/>
                    <SidebarAltContent/>
                    <SidebarFooter/>
                </TooltipProvider>
            </div>
        </aside>
    );
};

export default Sidebar;
