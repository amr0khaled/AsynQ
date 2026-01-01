'use client'
import { useTheme } from "@/hooks/use-theme";
import { SidebarTrigger } from "./ui/sidebar";
import { useEffect } from "react";


export default function DashboardHeader() {

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setTheme('dark')
  }, [])

  return <header className='w-full h-10 inline-flex items-center px-3'>
    <SidebarTrigger className='self-end hover:-translate-0' />
  </header>
}
