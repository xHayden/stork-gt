import './api.css'
import type { Metadata } from 'next'
import NavBar from "../components/NavBar";
import { Roboto } from 'next/font/google'

const roboto = Roboto({ weight: "400", subsets: ["latin"] });


export const metadata: Metadata = {
  title: 'Stork Race @ GT',
  description: 'The only Fantasy League where teams bet on which storks will migrate the fastest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (<>
    <div className={`flex w-full justify-end md:justify-normal`}>
      <NavBar admin={true}/>
    </div>
    <div className={`${roboto.className}`}>
        {children}
    </div>
    </>
  )
}
