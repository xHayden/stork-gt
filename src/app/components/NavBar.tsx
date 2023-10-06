'use client'
import { RefObject, forwardRef, useEffect, useRef, useState } from "react";
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'; // You need to install react-icons for these to work
import { BsPersonCircle } from "react-icons/bs"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import { Roboto, Rubik_Mono_One } from 'next/font/google'
import { Session } from "next-auth";
import { useOutsideClick } from "@/lib/hooks";

const rubik = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });
const roboto = Roboto({ weight: "400", subsets: ["latin"] });

interface NavBarProps {
    admin?: boolean
}

export default function NavBar(props: NavBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    
    return (
        <nav className={`absolute md:relative flex md:w-full flex-col md:flex-row justify-between p-2 md:p-4 m-2 border-b-8 font-bold text-sm md:text-xl ${rubik.className}`}>
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
                { status == "authenticated" ? <ProfileNavItem session={session} /> : <a onClick={() => signIn()} className="hover:cursor-pointer">Sign in</a> }
            </div>
        </nav>
    );
}

interface ProfileNavItemProps {
    session: Session;
}

interface ProfileDropdownProps {
    session: Session
}

const ProfileNavItem: React.FC<ProfileNavItemProps> = ({ session }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>();
    const iconRef = useRef<HTMLDivElement>();

    useOutsideClick([dropdownRef as RefObject<HTMLDivElement>, iconRef as RefObject<HTMLDivElement>], () => {
        setShowDropdown(false);
    });

    return <div className="relative">
        <div className="bg-white rounded-full border-black p-2 border hover:cursor-pointer" ref={iconRef as RefObject<HTMLDivElement>} onClick={() => {setShowDropdown(!showDropdown)}}>
            <BsPersonCircle size={30} color="black" />
        </div>
        { showDropdown ? <ProfileDropdown session={session} ref={dropdownRef as RefObject<HTMLDivElement>} /> : <></>}
    </div>
}

const ProfileDropdown = forwardRef<HTMLDivElement, ProfileDropdownProps>(({session}: ProfileDropdownProps, ref) => {
    return <div ref={ref} className={`absolute right-0 top-full bg-white rounded-xl my-2 w-max px-4 py-2 text-black flex flex-col gap-2 ${roboto.className} shadow-lg`}>
        <p>Hi, <span className="font-semibold">{session.user.name}</span></p>
        <hr></hr>
        <Link style={{textShadow: "none"}} className="hover:cursor-pointer" href="/profile">Profile</Link>
        <Link style={{textShadow: "none"}} href="/">My Team</Link>
        <Link style={{textShadow: "none"}} href="/profile/orders">Order History</Link>
        <hr></hr>
        <p className="hover:cursor-pointer">Logout</p>
    </div>
});

ProfileDropdown.displayName = "ProfileDropdown";