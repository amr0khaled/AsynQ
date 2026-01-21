'use client'
import DashboardHeader from "@/components/dashboard-header"
import HistorySidebar from "@/components/history-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import Chat from "@/hooks/use-chat"
import { auth } from "@/lib/firebase/client"
import { useRouter } from "next/navigation"

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const { user, loading } = useAuth(auth)
  const router = useRouter()
  if (!user && loading) {
    router.replace('/login')
  }
  return <Chat>
    <SidebarProvider>
      <HistorySidebar />
      <SidebarInset>
        <DashboardHeader />
        <section className='flex flex-col w-full'>
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  </Chat>
}
