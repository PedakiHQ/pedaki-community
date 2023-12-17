import React from 'react';
import SidebarLink from "~/components/layout/Sidebar/SidebarLink.tsx";
import {IconBookText, IconSettings} from "@pedaki/design/ui/icons";

const SidebarAltContent = () => {
  return (
    <div className="">
      <SidebarLink href="/settings" icon={IconSettings} title="Parametres" />
      <SidebarLink href="https://docs.pedaki.fr" icon={IconBookText} title="Documentation"  />
    </div>
  );
};

export default SidebarAltContent;
