"use client"
import type { Metadata } from 'next'
import { SessionProvider } from "next-auth/react"
import { Session } from 'next-auth';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';

export default function RootLayout({
  children,
  session
}: {
  children: React.ReactNode
  session: Session
}) {
  return (
    <html lang="en" className=''>
      <body className={`flex-col flex min-h-screen`}>
        <MantineProvider>
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
