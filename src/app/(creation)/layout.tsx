import DashboardHeader from "@/components/dashboard-header"
import HistorySidebar from "@/components/history-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"



type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
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
