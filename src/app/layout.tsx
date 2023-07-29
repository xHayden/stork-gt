"use client"
import type { Metadata } from 'next'
import { Rubik_Mono_One } from 'next/font/google'
import { SessionProvider } from "next-auth/react"
import { Session, getServerSession } from 'next-auth';
import { authOptions } from './api/v1/auth/route';
import { useEffect, useState } from 'react';

const angkor = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Stork Race @ GT',
  description: 'The only Fantasy League where teams bet on which storks will migrate the fastest',
}

export default function RootLayout({
  children,
  session
}: {
  children: React.ReactNode
  session: Session
}) {
  // const [session, setSession] = useState<Session>();
  // useEffect(() => {
  //   const getSession = async () => {
  //     const ses = await getServerSession(authOptions);
  //     if (ses) {
  //       setSession(ses);
  //     }
  //   }
  //   getSession();
  // }, [])

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
