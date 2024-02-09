import Image from "next/image";
import Logo from "../icon.png";
import { Roboto, Rubik_Mono_One } from "next/font/google";
const rubik = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });
const roboto = Roboto({ weight: "400", subsets: ["latin"] });
import { MdArrowForward } from "react-icons/md";
import Link from "next/link";

const Footer = () => {
    return <footer className="flex flex-col md:flex-row gap-2 justify-between mx-4 md:mx-12 p-2 w-full bottom-0 items-start md:py-4 md:max-w-[70em] 2xl:max-w-[100em]"> 
        <div className="md:flex flex-col md:self-end hidden">
            <Image 
                src={Logo}
                height={50}
                width={50}
                alt="Fantasy Stork League Logo"
            />
            <p className="text-xs">Fantasy Stork League © {new Date().getFullYear()}</p>
        </div>
        <div className="flex flex-col text-sm font-light">
            <p className="font-bold uppercase text-xs text-slate-600 pb-1">Pages</p>
            <Link href="/about">About Us</Link>
            <Link href="/rankings">Leaderboard</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/api">API</Link>
        </div>
        <div className="flex flex-col text-sm font-light">
            <p className="font-bold uppercase text-xs text-slate-600 pb-1">Find us on...</p>
            <a href="https://instagram.com/storkrace">Instagram</a>
            <a href="https://github.com/xHayden/stork-gt">GitHub</a>
            <a href="mailto:me@hayden.gg">Email</a>
        </div>
        <div className="h-full relative hover:scale-[101%] transition-all self-center w-full md:w-max md:self-auto">
            <MdArrowForward size={25} className="absolute top-1 right-1 -rotate-45" color="white" />
            <button className='text-sm self-bottom w-full bg-amber-500 font-extrabold text-white border-amber-700 py-2 px-8 border-b-4 h-full flex items-center justify-center'>
                <p className="">
                Join FSL on Discord
                </p>
            </button>
        </div>
        <div className="flex flex-col md:self-end md:hidden">
            <p className="text-xs">Fantasy Stork League © {new Date().getFullYear()}</p>
        </div>
    </footer>
}

export default Footer;