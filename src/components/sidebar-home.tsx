import { useRouter } from "next/navigation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { kyivType } from "./header";
import { X } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/client";
import { useCredits } from "@/hooks/use-credits";
import { Button } from "./ui/button";


export default function SidebarHome() {
  const { push } = useRouter()
  const { setOpenMobile } = useSidebar()
  const [user, loading] = useAuthState(auth)
  const { credits } = useCredits()
  return <Sidebar className='gap-8 justify-between'>
    <SidebarHeader>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className={`${kyivType.className} hover:bg-transparent text-xl`}>
                AsynQ
              </SidebarMenuButton>
              <SidebarMenuAction
                className='cursor-pointer'
                onClick={() => setOpenMobile(false)}
              >
                <X />
              </SidebarMenuAction>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className='px-4 gap-y-4'>
            <SidebarMenuItem>
              {
                !loading && user ?
                  `Hi, ${user.displayName}!`
                  : `Hi, Guest!`
              }
            </SidebarMenuItem>
            <SidebarMenuItem>
              {
                (!loading && user)
                &&
                <span className='credits' >
                  Credits: {credits}
                </span>
              }
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className='gap-y-2'>
            <SidebarMenuItem>
              <SidebarMenuButton
                size='default'
                className='justify-center'
                onClick={() => push("/login")}
                asChild>
                <Button className='hover:translate-0 h-full'>
                  Log In
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => push("/signup")}
                className='h-full justify-center'>
                Sign Up
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarFooter>
  </Sidebar>
}
