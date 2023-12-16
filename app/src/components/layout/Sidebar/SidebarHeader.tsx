import { Separator } from '@pedaki/design/ui/separator';
import Logo from '~/components/logo.tsx';
import React from 'react';

const SidebarHeader = () => {
  return (
    <div className="flex flex-col gap-2 p-4 group-data-[collapsed=true]/sidebar:items-center">
      <div className="rounded-md  p-4 hover:bg-weak">
        <div className="flex h-10 items-center gap-4">
          <div className="h-8 w-8">
            <Logo />
          </div>
          <div className="space-y-1 group-data-[collapsed=true]/sidebar:hidden">
            <p className="text-label-sm font-medium">Demo</p>
            <p className="w-[20ch] overflow-hidden overflow-ellipsis text-p-xs text-sub">
              Selection de workspace
            </p>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default SidebarHeader;
