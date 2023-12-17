import {Button} from '@pedaki/design/ui/button';
import {IconPanelLeftClose, IconPanelLeftOpen} from '@pedaki/design/ui/icons';
import {Separator} from '@pedaki/design/ui/separator';
import Logo from '~/components/logo.tsx';
import React from 'react';
import {Tooltip, TooltipContent, TooltipTrigger} from "@pedaki/design/ui/tooltip";

interface SidebarHeaderProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const SidebarHeader = ({collapsed, setCollapsed}: SidebarHeaderProps) => {
    return (
        <div className={'flex flex-col gap-2  group-data-[collapsed=true]/sidebar:items-center'}>
            <div className="flex justify-between rounded-md p-4 pb-2">
                <div className={'flex h-10 items-center gap-4 group-data-[collapsed=true]/sidebar:hidden'}>
                    <div className="h-8 w-8 shrink-0">
                        <Logo/>
                    </div>
                    <div className="space-y-1">
                        <p className="text-label-sm font-medium">Demo</p>
                    </div>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onlyIcon="true"
                            size="xs"
                            variant="stroke-primary-main"
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-0"
                        >
                            <IconPanelLeftClose className="h-4 w-4 inline group-data-[collapsed=true]/sidebar:hidden"/>
                            <IconPanelLeftOpen className="h-4 w-4 inline group-data-[collapsed=false]/sidebar:hidden"/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                        <p>
                            {/*TODO translate*/}
                            {collapsed ? 'Expand' : 'Collapse'} sidebar
                        </p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <Separator/>
        </div>
    );
};

export default SidebarHeader;
