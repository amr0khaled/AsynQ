import "@/styles/globals.css";
import { Poppins } from 'next/font/google'
import Footer from "@/components/footer";
import Header from "@/components/header";
import './suppress-warnings'
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900']
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${poppins.className} antialiased`}
      >
        <Header />
        <main className='min-h-[calc(100vh-80px)] w-full pt-20'>
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
