import "@/styles/globals.css";
import { Poppins } from 'next/font/google'
// import '@/app/suppress-warnings'
import { Toaster } from "@/components/ui/sonner";
import Credits from "@/hooks/use-credits";
const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className='dark'
      suppressHydrationWarning
    >
      <body
        className={`${poppins.className} antialiased`}
      >
        <Credits>
          {children}
          <Toaster />
        </Credits>
      </body>
    </html>
  );
}
