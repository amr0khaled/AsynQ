'use client'
import { useTheme } from "@/hooks/use-theme";
import { SidebarTrigger } from "./ui/sidebar";
import { useEffect } from "react";
import { kyivType } from "./header";


export default function DashboardHeader() {

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setTheme('dark')
  }, [])

  return <header className='w-full h-10 flex items-center px-3 py-1 gap-x-2'>
    <span className={`${kyivType.className} h-fit text-xl`}>
      AsynQ
    </span>
  </header>
}
