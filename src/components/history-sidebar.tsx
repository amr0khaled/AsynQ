'use client'
import { EllipsisVertical, Search, Trash } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarSeparator, useSidebar } from "./ui/sidebar";
import { useEffect, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Post } from "@/lib/types";
import { kyivType } from "./header";
import { useRouter } from "next/navigation";

export default function HistorySidebar() {
  const {
    isPending,
    posts,
    post,
    changePost,
    deletePost,
  } = useChat()
  const { push } = useRouter()
  const [currentPosts, setPosts] = useState<Post[]>([])
  const { state } = useSidebar()
  const isMobile = useIsMobile()
  useEffect(() => {
    setPosts(posts)
  }, [posts])
  const handleSearch = (search: string) => {
    const reg = new RegExp(search.toLowerCase().trim())
    setPosts(() => [...posts.filter(({ prompt }) => !!prompt.toLowerCase().match(reg))])
  }
  return <Sidebar variant="inset">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className='text-left hover:bg-transparent'>
            <span className={`${kyivType.className} h-fit text-xl cursor-pointer`} onClick={() => push('/')}>
              AsynQ
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarGroup className='flex flex-row items-center justify-between'>
        <SidebarGroupContent
          className='relative'
          aria-disabled={state === 'collapsed'}
        >
          <Label
            htmlFor="search"
            className='sr-only'
          >Search</Label>
          <SidebarInput
            id="search"
            placeholder="Search the posts..."
            className='pl-8'
            onChange={(e) => {
              handleSearch(e.target.value)
            }}
          />
          <Search
            className='absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none my-auto pointer-events-none '
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>History</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {
              (isPending && currentPosts.length < 1) ?
                Array.from({ length: 10 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))
                :
                currentPosts.map(({ id, prompt }) => (
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
                      <DropdownMenuContent
                        side={isMobile ? 'bottom' : 'right'}
                        align={isMobile ? 'end' : 'center'}
                      >
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
