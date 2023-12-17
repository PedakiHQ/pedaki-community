import { Separator } from '@pedaki/design/ui/separator';
import SidebarFooterUser from '~/components/layout/Sidebar/SidebarFooterUser.tsx';
import React, { Suspense } from 'react';

const SidebarFooter = () => {
  return (
    <div>
      <Separator />
      <Suspense fallback={<div>Loading...</div>}>
        <SidebarFooterUser />
      </Suspense>
    </div>
  );
};

export default SidebarFooter;
