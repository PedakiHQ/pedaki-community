'use client';

import { Button } from '@pedaki/design/ui/button';
import { IconPanelLeftClose, IconPanelLeftOpen } from '@pedaki/design/ui/icons';
import { Separator } from '@pedaki/design/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@pedaki/design/ui/tooltip';
import Logo from '~/components/logo.tsx';
import { useGlobalStore } from '~/store/global/global.store.ts';
import { useWorkspaceStore } from '~/store/workspace/workspace.store.ts';
import React from 'react';

interface SidebarHeaderProps {
  collapsed: boolean;
}

const SidebarHeader = ({ collapsed }: SidebarHeaderProps) => {
  const setCollapsed = useGlobalStore(state => state.setCollapsed);
  const workspaceName = useWorkspaceStore(state => state.settings.name);

  return (
    <div className="hidden flex-col gap-2 group-data-[collapsed=true]/sidebar:items-center sm:flex">
      <div className="flex justify-between rounded-md p-4 pb-2">
        <div className="flex h-10 items-center gap-4 group-data-[collapsed=true]/sidebar:hidden">
          <div className="h-8 w-8 shrink-0">
            <Logo />
          </div>
          <div className="space-y-1">
            <p className="max-w-[12ch] overflow-hidden break-words text-label-sm font-medium">
              {workspaceName}
            </p>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="stroke-primary-main"
              onClick={() => setCollapsed?.(!collapsed)}
              className="p-0"
            >
              <IconPanelLeftClose className="inline h-4 w-4 group-data-[collapsed=true]/sidebar:hidden" />
              <IconPanelLeftOpen className="inline h-4 w-4 group-data-[collapsed=false]/sidebar:hidden" />
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
      <Separator />
    </div>
  );
};

export default SidebarHeader;
