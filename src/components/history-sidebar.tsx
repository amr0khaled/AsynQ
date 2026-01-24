'use client'
import { EllipsisVertical, Search, Trash } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarTrigger, useSidebar } from "./ui/sidebar";
import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase/client";
import { useChat } from "@/hooks/use-chat";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";


export default function HistorySidebar() {
  const {
    isPending,
    posts,
    post,
    loadPosts,
    changePost,
    deletePost
  } = useChat()
  const { state } = useSidebar()

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
              (isPending && posts.length < 1) ?
                Array.from({ length: 10 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))
                :
                posts.map(({ id, prompt }) => (
                  <SidebarMenuItem onClick={() => changePost(id)} key={id}>
                    <SidebarMenuButton className='transition-colors duration-100' isActive={post?.id === id}>
                      <span className='w-48 text-xs truncate'>
                        {prompt}
                      </span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <EllipsisVertical className='size-0' />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem variant="destructive" onClick={() => deletePost(id)}>
                          <Trash />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
