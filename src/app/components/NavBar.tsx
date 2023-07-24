'use client'
import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'; // You need to install react-icons for these to work

interface NavBarProps {
    admin?: boolean
}

export default function NavBar(props: NavBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <nav className="absolute md:relative flex md:w-full flex-col md:flex-row justify-between p-2 md:p-4 m-2 border-b-8 font-bold text-sm md:text-xl">
            <div className="visible md:hidden flex w-full justify-end">
                <button onClick={() => setIsOpen(!isOpen)} className="border-none p-0">
                    {isOpen ? <HiOutlineX className="h-8 w-8"/> : <HiOutlineMenu className="h-8 w-8"/>}
                </button>
            </div>
            <div className="flex justify-between items-center">
                <div className={`${isOpen ? 'flex' : 'hidden'} md:flex gap-0 md:gap-6 flex-col md:flex-row`}>
                    <a>Home</a>
                    <a>About</a>
                    <a>Store</a>
                </div>
            </div>
            <div className={`${isOpen ? 'flex' : 'hidden'} md:flex gap-0 md:gap-6 flex-col md:flex-row`}>
                <a>Mapbox</a>
                <a>Rankings</a>
            </div>
        </nav>
    );
}