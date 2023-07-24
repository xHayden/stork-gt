import './admin.css'
import type { Metadata } from 'next'
import NavBar from "../components/NavBar";
import { Space_Mono } from 'next/font/google'

const angkor = Space_Mono({ weight: "400", subsets: ["latin"] });


export const metadata: Metadata = {
  title: 'Stork Race @ GT',
  description: 'The only Fantasy League where teams bet on which storks will migrate the fastest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (<div>
    <div className={`flex w-full justify-end md:justify-normal`}>
      <NavBar admin={true}/>
    </div>
    <div className={`${angkor.className}`}>
        {children}
    </div>
    </div>
  )
}
