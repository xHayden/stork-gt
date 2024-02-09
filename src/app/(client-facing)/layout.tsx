import { Toaster } from 'react-hot-toast'
import NavBar from '../components/NavBar'
import { Notifications } from '../components/Notifications'
import '../globals.css'
import type { Metadata } from 'next'
import Footer from '../components/Footer'

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
      <Toaster />
      <NavBar/>
    </div>
    <div className='relative w-full'>
      {children}
      <div className='w-full flex justify-center'>
        <Footer />
      </div>
    </div>
  </>)
}
