'use client'
import { useEffect, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'; // You need to install react-icons for these to work
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import { Roboto, Rubik_Mono_One } from 'next/font/google'
import { Notifications } from "./Notifications";
import { ProfileNavItem } from "./ProfileDropdown";

const rubik = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });
const roboto = Roboto({ weight: "400", subsets: ["latin"] });

interface NavBarProps {
    admin?: boolean
}

export default function NavBar(props: NavBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const session = useSession();
    const user = session.data?.user;

    return (
        <>
        <nav className="hidden md:flex items-center w-full py-8 px-8 gap-2">
            <div className="flex justify-between w-full items-center">
                <div className={`text-lg ${roboto.className} gap-4 flex`}>
                    <Link className="border-0 shadow-none hover:cursor-pointer" style={{textShadow: "none"}} href="/">Home</Link>
                    <Link className="border-0 shadow-none hover:cursor-pointer" style={{textShadow: "none"}} href="/leaderboard">Leaderboard</Link>
                    { user?.admin ? <Link className="border-0 shadow-none hover:cursor-pointer" style={{textShadow: "none"}} href="/admin">Admin</Link> : <></> }
                </div>
                { session.status == "unauthenticated" ? <a className="border-0 shadow-none hover:cursor-pointer" style={{textShadow: "none"}} onClick={() => signIn()} >Sign In</a> : <>
                </> }
                { session ? <div className="flex gap-4">
                    <ProfileNavItem session={session}/>
                </div> : <></> }
            </div>
        </nav>
        <nav className={`visible md:hidden absolute md:relative flex md:w-full flex-col md:flex-row justify-between p-2 md:p-4 m-2 border-b-8 font-bold text-sm md:text-xl text-white bg-amber-400 border-amber-600 ${rubik.className} z-10`}>
            <div className="flex w-full justify-end">
                <button onClick={() => setIsOpen(!isOpen)} className="border-none p-0 z-10">
                    {isOpen ? <HiOutlineX className="h-8 w-8 text-white"/> : <HiOutlineMenu className="h-8 w-8 text-white"/>}
                </button>
            </div>
            <div className="flex justify-between items-center">
                <div className={`${isOpen ? 'flex' : 'hidden'} md:flex gap-0 md:gap-6 flex-col md:flex-row rounded-2xl`}>
                    <Link href="/">
                        Home
                    </Link>
                    {/* <Link href="/about">About</Link> */}
                    {/* <Link href="/store">Store</Link> */}
                </div>
            </div>
            <div className={`${isOpen ? 'flex' : 'hidden'} md:flex gap-0 md:gap-6 flex-col md:flex-row`}>
                {/* <Link href="/map">Map</Link>
                <Link href="/rankings">Rankings</Link> */}
                { session.status == "authenticated" ? <ProfileNavItem session={session} /> : <a onClick={() => signIn()} className="hover:cursor-pointer">Sign in</a> }
            </div>
        </nav>
        </>
    );
}