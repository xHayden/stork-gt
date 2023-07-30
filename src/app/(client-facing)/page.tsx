import Disclaimer from '@/app/components/Disclaimer'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex justify-center items-center 3xl:items-start 3xl:m-24 flex-grow">
      <div className='w-11/12 md:w-2/3 gap-8 flex flex-col'> 
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-red-500">It&apos;s Storkin&apos; Time!</h1>
        <p className='text-xl md:text-3xl 2xl:text-4xl text-red-400'>
          Get ready for the only Fantasy League where teams bet on
          which storks will migrate the fastest.
        </p>
        <div className='flex justify-center text-lg md:text-2xl'>
          <button className='2xl:text-2xl w-full'>
            Join us on our mission
          </button>
        </div>
        <Disclaimer/>
      </div>
    </main>
  )
}
