import { Roboto } from "next/font/google";

const roboto = Roboto({ weight: ["400", "500", "700", "900"], subsets: ["latin"] });


export default function About() {

    return <main className="">
        <div className="w-full mx-auto flex flex-col gap-4">
            <h1 className="text-5xl w-max mx-auto text-red-500 text-shadow">About</h1>
            <p className={`${roboto.className} max-w-[50em] w-max mx-auto text-center text-xl`}>
                Every year, storks from all around the world fly to Germany for the Spring.
                <span className="font-bold"> We see this as an opportunity.</span><br></br>
                Much like Fantasy Football&apos;s Tom Brady or Peyton Manning, we have Anton and Schweizzeried 1 flying to Germany.
            </p>
        </div>
    </main>
}