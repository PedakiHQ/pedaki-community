import { Button } from '@pedaki/design/ui/button';
import { IconPanelLeftClose, IconPanelLeftOpen } from '@pedaki/design/ui/icons';
import { Separator } from '@pedaki/design/ui/separator';
import { cn } from '@pedaki/design/utils';
import Logo from '~/components/logo.tsx';
import React from 'react';

interface SidebarHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarHeader = ({ collapsed, setCollapsed }: SidebarHeaderProps) => {
  return (
    <div className={cn('flex flex-col gap-2', collapsed && 'items-center')}>
      <div className="relative rounded-md p-4">
        <div className={cn('flex h-10 items-center gap-4', collapsed && 'hidden')}>
          <div className="h-8 w-8 shrink-0">
            <Logo />
          </div>
          <div className="space-y-1">
            <p className="text-label-sm font-medium">Demo</p>
          </div>
        </div>
        <div className={cn(collapsed ? '' : 'absolute right-0 top-0')}>
          <Button
            onlyIcon="true"
            size="xs"
            variant="stroke-primary-main"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <IconPanelLeftOpen className="h-4 w-4" />
            ) : (
              <IconPanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default SidebarHeader;
