'use client'
import { useEffect, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'; // You need to install react-icons for these to work
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import { Rubik_Mono_One } from 'next/font/google'

const rubik = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });

interface NavBarProps {
    admin?: boolean
}

export default function NavBar(props: NavBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        console.log(session)
    }, [session])
    
    return (
        <nav className={`absolute md:relative flex md:w-full flex-col md:flex-row justify-between p-2 md:p-4 m-2 border-b-8 font-bold text-sm md:text-xl zIndex1 ${rubik.className}`}>
            <div className="visible md:hidden flex w-full justify-end">
                <button onClick={() => setIsOpen(!isOpen)} className="border-none p-0">
                    {isOpen ? <HiOutlineX className="h-8 w-8"/> : <HiOutlineMenu className="h-8 w-8"/>}
                </button>
            </div>
            <div className="flex justify-between items-center">
                <div className={`${isOpen ? 'flex' : 'hidden'} md:flex gap-0 md:gap-6 flex-col md:flex-row`}>
                    <Link href="/">Home</Link>
                    {/* <Link href="/about">About</Link> */}
                    {/* <Link href="/store">Store</Link> */}
                </div>
            </div>
            <div className={`${isOpen ? 'flex' : 'hidden'} md:flex gap-0 md:gap-6 flex-col md:flex-row`}>
                {/* <Link href="/map">Map</Link>
                <Link href="/rankings">Rankings</Link> */}
                <a onClick={() => signIn()} className="hover:cursor-pointer">Sign in</a>
            </div>
        </nav>
    );
}