"use client"
import type { Metadata } from 'next'
import { Rubik_Mono_One } from 'next/font/google'
import { SessionProvider } from "next-auth/react"
import { Session } from 'next-auth';

const angkor = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
  session
}: {
  children: React.ReactNode
  session: Session
}) {
  return (
    <html lang="en" className=''>
      <body className={`${angkor.className} flex-col flex min-h-screen`}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
