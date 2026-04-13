import AppSideBar from '@/components/Application/admin/AppSideBar'
import ThemeProvider from '@/components/Application/admin/ThemeProvider'
import TopBar from '@/components/Application/admin/TopBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({ children }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSideBar />
                <main className='md:w-[calc(100vw-16rem)]'>
                    <div className='pt-[70px] px-5 min-h-[calc(100vh-40px)] pb-10'>
                        <TopBar />
                        {children}
                    </div>
                    <div className='border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm'>
                        <p>© {new Date().getFullYear()} ShopNest. All rights reserved.</p>
                    </div>
                </main>
            </SidebarProvider>
        </ThemeProvider>
    )
}

export default layout