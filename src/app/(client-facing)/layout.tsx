import NavBar from '../components/NavBar'
import '../globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fantasy Stork League @ GT',
  description: 'The only Fantasy League where teams bet on which storks will migrate the fastest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (<>
    <div className='flex w-full justify-end md:justify-normal'>
      <NavBar/>
    </div>
    {children}
  </>)
}
