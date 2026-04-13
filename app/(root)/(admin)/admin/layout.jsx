import AppSideBar from '@/components/Application/admin/AppSideBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({ children }) => {
    return (
        <SidebarProvider>
            <AppSideBar />
            <main>{children}</main>
        </SidebarProvider>
    )
}

export default layout