import { Separator } from '@pedaki/design/ui/separator';
import SidebarFooterUser from '~/components/layout/Sidebar/SidebarFooterUser.tsx';
import React, { Suspense } from 'react';

const SidebarFooter = () => {
  return (
    <div className="hidden sm:block">
      <Separator />
      <Suspense fallback={<div>Loading...</div>}>
        <SidebarFooterUser />
      </Suspense>
    </div>
  );
};

export default SidebarFooter;
