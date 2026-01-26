'use client'
import { useTheme } from "@/hooks/use-theme";
import { useEffect } from "react";
import { SidebarTrigger } from "./ui/sidebar";


export default function DashboardHeader() {
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('dark');
  }, [])

  return <header className='w-full md:h-10 h-14 py-2 md:py-0 flex items-center px-3'>
    <SidebarTrigger
      className='hover:translate-0 size-8'
    />
  </header>
}
