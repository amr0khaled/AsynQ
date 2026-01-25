'use client'
import Footer from "@/components/footer";
import Header from "@/components/header";
import SidebarHome from "@/components/sidebar-home";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useIsMobile()
  const Fragment = ({ children }: { children: React.ReactNode }) => {
    if (!isMobile) {
      return <>
        {children}
      </>
    }
    return <SidebarProvider className="block">
      <SidebarHome />
      {children}
    </SidebarProvider>
  }
  return <Fragment>
    <Header />

    <main className='min-h-[calc(100vh-80px)] w-full pt-20'>
      {children}
    </main>
    <Footer />
  </Fragment>
}
