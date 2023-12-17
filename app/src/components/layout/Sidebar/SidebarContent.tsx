import React from 'react';
import type {SidebarLinkProps} from "~/components/layout/Sidebar/SidebarLink.tsx";
import SidebarLink from "~/components/layout/Sidebar/SidebarLink.tsx";
import {IconSettings} from "@pedaki/design/ui/icons";
const items = [
    {
        icon: IconSettings,
        title: "Eleves",
        items: [
            {
                title: "Liste des eleves",
                href: "/students",
            },
            {
                title: "Child 2",
                href: "/a",
            },
            {
                title: "Child 3",
                href: "/b",
            }
        ]
    },
    {
        icon: IconSettings,
        title: "Classes",
        items: [
            {
                title: "Child 1",
                href: "/",
            },
            {
                title: "Child 2",
                href: "/c",
            },
            {
                title: "Child 3",
                href: "/d",
            }
        ]
    }
] as SidebarLinkProps[];


const SidebarContent = () => {
    return (
        <div className="flex-1 flex flex-col gap-1" role="navigation">
            {items.map((item, index) => (
                <SidebarLink key={index} {...item}/>
            ))}
        </div>
    );
};

export default SidebarContent;
