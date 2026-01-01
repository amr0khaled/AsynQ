import Footer from "@/components/footer";
import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <Header />
    <main className='min-h-[calc(100vh-80px)] w-full pt-20'>
      {children}
    </main>
    <Footer />
  </>
}
