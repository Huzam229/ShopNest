"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarMenuSub,
    SidebarMenuSubItem,
    useSidebar
} from "@/components/ui/sidebar";

import Image from "next/image";
import logoBlack from "@/public/assets/images/logo-black.png";
import logoWhite from "@/public/assets/images/logo-white.png";

import { Button } from "@/components/ui/button";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

import { adminAppSidebarMenu } from "@/lib/adminSideBarMenu";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";

import Link from "next/link";

const AppSideBar = () => {
    const { toggleSidebar } = useSidebar()
    return (
        <Sidebar className='z-50'>

            <SidebarHeader className='border-b h-14 p-0'>
                <div className="flex justify-between items-center px-4">
                    <Image
                        src={logoBlack}
                        height={50}
                        className="block dark:hidden h-[50px] w-auto"
                        alt="logo-dark"
                    />

                    <Image
                        src={logoWhite}
                        height={50}
                        className="hidden dark:block h-[50px] w-auto"
                        alt="logo-white"
                    />

                    <Button type="button" onClick={() => toggleSidebar()} size="icon" className="md:hidden">
                        <IoMdClose />
                    </Button>
                </div>
            </SidebarHeader>

            <SidebarContent className='p-3'>
                <SidebarMenu>

                    {adminAppSidebarMenu.map((item, index) => {
                        const hasSubmenu = item?.submenu?.length > 0;

                        return (
                            <Collapsible key={index} className='group/collapsible'>

                                <SidebarMenuItem className='mb-4'>

                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton className='font-semibold px-2 py-2'>

                                            {hasSubmenu ? (
                                                <>
                                                    {item.icon && <item.icon />}
                                                    {item.title}

                                                    <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </>
                                            ) : (
                                                <Link
                                                    href={item?.url || '#'}
                                                    className="flex items-center gap-2 w-full"
                                                >
                                                    {item.icon && <item.icon />}
                                                    {item.title}
                                                </Link>
                                            )}

                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    {/* SUBMENU */}
                                    {hasSubmenu && (
                                        <CollapsibleContent>
                                            <SidebarMenuSub>

                                                {item.submenu.map((submenu, subIndex) => (
                                                    <SidebarMenuSubItem key={subIndex}>
                                                        <SidebarMenuButton asChild className='px-2 py-2'>
                                                            <Link href={submenu?.url || '#'}>
                                                                {submenu.icon && <submenu.icon />}
                                                                {submenu.title}
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                ))}

                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    )}

                                </SidebarMenuItem>

                            </Collapsible>
                        );
                    })}

                </SidebarMenu>
            </SidebarContent>

        </Sidebar>
    );
};

export default AppSideBar;