import "@/styles/globals.css";
import { Poppins } from 'next/font/google'
import '@/app/suppress-warnings'
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
    <html lang="en" className='dark'>
      <body
        suppressHydrationWarning={true}
        className={`${poppins.className} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
