'use client'
import { EllipsisVertical, Search } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarTrigger, useSidebar } from "./ui/sidebar";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase/client";
import { useChat } from "@/hooks/use-chat";
import { Spinner } from "./ui/spinner";


export default function HistorySidebar() {
  const { isPending, loadPosts, posts, changePost } = useChat()
  const { state } = useSidebar()
  const { loading } = useAuth(auth)

  useEffect(() => {
    if (loading) return
    loadPosts()
  }, [loading])

  return <Sidebar variant="inset" collapsible="icon">
    <SidebarHeader>
      <SidebarMenu className='flex flex-row items-center justify-between'>
        <SidebarMenuItem>
          <SidebarTrigger
            variant={'primary'}
            className='self-end hover:translate-0 size-8'
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
            {
              isPending ?
                Array.from({ length: 10 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))
                :
                posts.map(({ id, prompt }) => (
                  <SidebarMenuItem onClick={() => changePost(id)} key={id}>
                    <SidebarMenuButton>
                      <span className='w-48 text-xs truncate'>
                        {prompt}
                      </span>
                    </SidebarMenuButton>
                    <SidebarMenuAction>
                      <EllipsisVertical className='size-0' />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))
            }
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter />
  </Sidebar>
}
