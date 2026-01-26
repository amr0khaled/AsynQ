'use client'
import DashboardHeader from "@/components/dashboard-header"
import HistorySidebar from "@/components/history-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import Chat from "@/hooks/use-chat"
import { auth } from "@/lib/firebase/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  useEffect(() => {
    if (!user && !loading) {
      router.replace('/login')
    }
  })
  return <Chat>
    <SidebarProvider>
      <HistorySidebar />
      <SidebarInset className="z-50">
        <DashboardHeader />
        <section className='flex flex-col w-full'>
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  </Chat>
}
