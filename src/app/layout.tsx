import "@/styles/globals.css";
import { Poppins } from 'next/font/google'

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
        <main className='pt-20'>
          {children}
        </main>
      </body>
    </html>
  );
}
