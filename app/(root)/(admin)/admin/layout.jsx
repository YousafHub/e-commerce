import AppSideBar from '@/components/Application/Admin/AppSideBar'
import ThemeProvider from '@/components/Application/Admin/ThemeProvider'
import TopBar from '@/components/Application/Admin/TopBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({ children }) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSideBar />
        <main className='md:w-[calc(100vw-16rem)] w-full'>
          <div className='pt-[70px] md:px-8 px-5 min-h-[calc(100vh-40px)] pb-10'>
            <TopBar />
            {children}
          </div>
          <div className='border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm'>
            @ 2025 Yousaf Shahid. All rights reserved.
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default layout