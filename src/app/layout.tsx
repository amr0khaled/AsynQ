import "@/styles/globals.css";
import { Poppins } from 'next/font/google'
// import '@/app/suppress-warnings'
import { Toaster } from "@/components/ui/sonner";
import Credits from "@/hooks/use-credits";
import Head from "next/head";
import { Metadata } from "next";
const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
})

const description = `AsynQ is a Content Creation AI Tool specialized in Writing.
Type your full prompt and get a multi-option post content.
Choose and edit your preferred option and save it for later.`

export const metadata: Metadata = {
  description,
  title: "AsynQ",
  other: {
    "google-site-verification": "mek-bCENZ188pkknvqDt0v2a0a6hxypnX8WT7D3hYzk"
  }
}
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
