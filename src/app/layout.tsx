import type { Metadata } from 'next'
import { Rubik_Mono_One } from 'next/font/google'

const angkor = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Stork Race @ GT',
  description: 'The only Fantasy League where teams bet on which storks will migrate the fastest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className=''>
      <body className={`${angkor.className} flex-col flex min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
