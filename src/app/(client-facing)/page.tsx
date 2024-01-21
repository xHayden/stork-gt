import Disclaimer from '@/app/components/Disclaimer'
import { Roboto, Rubik_Mono_One } from 'next/font/google';
import Image from 'next/image'
const rubik = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });
const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`my-6 md:my-0 mx-2 3xl:my-24 flex-col flex gap-12 xl:gap-16 3xl:gap-24 ${rubik.className}`}>
      <div className='flex justify-center items-center 3xl:items-start flex-grow'>
        <div className='gap-8 flex flex-col items-center md:max-w-[70em] 2xl:max-w-[100em] w-full'> 
          <h1 className="text-5xl md:text-6xl lg:text-8xl text-amber-500 text-shadow md:self-center md:text-center">It&apos;s Storkin&apos; Time!</h1>
          <p className='text-xl md:text-3xl 2xl:text-4xl text-amber-500 max-w-[1200px] text-center'>
            Get ready for the only Fantasy League where teams bet on
            which storks will migrate the fastest.
          </p>
          <div className='flex justify-center text-lg w-full'>
            <a href='https://discord.gg/MxgNmdTKak' target='_blank' className='w-full'>
              <button className='md:text-2xl lg:text-4xl w-full bg-amber-500 text-white border-amber-700 py-4 px-6 border-b-4 hover:scale-[101%] transition-all'>
                Join Fantasy Stork League
              </button>
            </a>
          </div>
          <Disclaimer/>
        </div>
      </div>
      <div className='md:max-w-[70em] 2xl:max-w-[100em] gap-4 flex flex-col justify-center mx-auto pb-8'>
        <div>
          <h2 className={`text-4xl lg:text-5xl xl:text-7xl text-amber-500 text-shadow w-max`}>What?</h2>
          <p className={`${roboto.className} font-semibold text-xl lg:text-2xl`}>
            We host drafts where you can bet on the time storks take to migrate. The winner gets a trophy and free merch as well as all of the clout that comes with being the stork champion for the year.
          </p>
        </div>
        <div>
          <h2 className={`text-4xl lg:text-5xl xl:text-7xl text-amber-500 text-shadow w-max`}>When?</h2>
          <p className={`${roboto.className} font-semibold text-xl lg:text-2xl`}>
            The intro meeting is on February 9th from 5 to 6 PM. The competition will run through the Spring semester (migration time!!).
            There will only be three meetings: the intro meeting, the draft, and the awards ceremony, so make sure to come to all of them!
          </p>
        </div>
        <div>
          <h2 className={`text-4xl lg:text-5xl xl:text-7xl text-amber-500 text-shadow w-max`}>Where?</h2>
          <p className={`${roboto.className} font-semibold text-xl lg:text-2xl`}>
            College of Computing, Room 101
          </p>
        </div>
        <div>
          <h2 className={`text-4xl lg:text-5xl xl:text-7xl text-amber-500 text-shadow w-max`}>How?</h2>
          <p className={`${roboto.className} font-semibold text-xl lg:text-2xl`}>
            Teams are formed based on the number of people participating in a given season. 
            Usually, there are about 5 teams, but that will change with the number of people who show up.<br></br><br></br>
            Each team will have a week or two to prepare their stork picks for the draft. Once the draft begins,
            teams pick in a snake draft which storks they want to bet on. If a stork is picked, it cannot be picked
            again by a different team. This process repeats until each team has 6 storks. That data is piled into this website
            where a leaderboard will be updated daily.
          </p>
        </div>
        <div>
          <h2 className={`text-4xl lg:text-5xl xl:text-7xl text-amber-500 text-shadow w-max`}>Why?</h2>
          <p className={`${roboto.className} font-semibold text-xl lg:text-2xl`}>
            It&apos;s fun and we have free food!
          </p>
        </div>
      </div>
    </main>
  )
}
