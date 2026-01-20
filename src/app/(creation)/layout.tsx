'use client'
import DashboardHeader from "@/components/dashboard-header"
import HistorySidebar from "@/components/history-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { auth } from "@/lib/firebase/client"
import { useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'



type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const router = useRouter()
  const [user, loading, error] = useAuthState(auth)
  if (error) {
    toast.error(error.message)
  }

  useEffect(() => {
    if (loading) return
    if (!user) {
      toast.error("Unknown user. Redirecting...")
      router.replace('/login')
    }
  }, [user, loading])

  return <SidebarProvider>
    <HistorySidebar />
    <SidebarInset>
      <DashboardHeader />
      <section className='flex flex-col w-full'>
        {children}
      </section>
    </SidebarInset>
  </SidebarProvider>
}
