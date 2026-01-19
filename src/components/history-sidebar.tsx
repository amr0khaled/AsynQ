'use client'
import { Search } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "./ui/sidebar";


export default function HistorySidebar() {
  const { state } = useSidebar()
  return <Sidebar variant="inset" collapsible="icon">
    <SidebarHeader>
      <SidebarMenu className='flex flex-row items-center justify-between'>
        <SidebarMenuItem>
          <SidebarTrigger
            variant={'primary'}
            className='self-end hover:-translate-0 size-8'
          />
        </SidebarMenuItem>
        <SidebarMenuItem
          className={state === 'collapsed' ? 'invisible -translate-x-12' : ''}
          aria-disabled={state === 'collapsed'}
        >
          <SidebarMenuButton>
            <Search />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>History</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter />
  </Sidebar>
}
