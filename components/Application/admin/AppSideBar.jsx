import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader
} from "@/components/ui/sidebar"
import Image from "next/image"
import logoBlack from '@/public/assets/images/logo-black.png';
import logoWhite from '@/public/assets/images/logo-white.png'
import { Button } from "@/components/ui/button";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from 'react-icons/io'


const AppSideBar = () => {
    return (
        <Sidebar>
            <SidebarHeader className='border-b h-14 p-0'>
                <div className="flex justify-between items-center px-4">
                    <Image src={logoBlack.src} height={50} width={logoBlack.width} className="block dark:hidden h-[50px] w-auto" alt="logo-dark" />
                    <Image src={logoWhite.src} height={50} width={logoWhite.width} className="hidden dark:block h-[50px] w-auto" alt="logo-white" />
                    <Button type="button" size="icon" >
                        <IoMdClose />
                    </Button>
                </div>
            </SidebarHeader>

        </Sidebar>
    )
}

export default AppSideBar