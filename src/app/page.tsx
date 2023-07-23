import Disclaimer from '@/components/Disclaimer'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex justify-center items-center flex-grow">
      <div className='w-11/12 md:w-2/3 gap-8 flex flex-col'> 
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-yellow-200">It's storkin' time!</h1>
        <p className='text-white text-xl md:text-3xl'>
          Get ready for the only Fantasy League where teams bet on
          which storks will migrate the fastest.
        </p>
        <div className='flex justify-center text-lg md:text-2xl'>
          <button className=''>
            Join us on our mission
          </button>
        </div>
        <Disclaimer/>
      </div>
    </main>
  )
}
