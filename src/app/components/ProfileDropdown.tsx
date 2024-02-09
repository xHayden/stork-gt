"use client"

import { useFetchNotifications, useOutsideClick } from "@/lib/hooks";
import { Session } from "next-auth";
import { SessionContextValue, signOut } from "next-auth/react";
import { Roboto } from "next/font/google";
import Link from "next/link";
import { RefObject, forwardRef, useRef, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { DBNotification } from "../types";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

interface ProfileNavItemProps {
    session: SessionContextValue;
}

interface ProfileDropdownProps {
    session: SessionContextValue
}

export const ProfileNavItem: React.FC<ProfileNavItemProps> = ({ session }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>();
    const iconRef = useRef<HTMLDivElement>();

    useOutsideClick([dropdownRef as RefObject<HTMLDivElement>, iconRef as RefObject<HTMLDivElement>], () => {
        setShowDropdown(false);
    });

    return <div className="relative">
        <div className="bg-white rounded-full hover:cursor-pointer " ref={iconRef as RefObject<HTMLDivElement>} onClick={() => {setShowDropdown(!showDropdown)}}>
            <BsPersonCircle size={30} color="black" />
        </div>
        { showDropdown ? <ProfileDropdown session={session} ref={dropdownRef as RefObject<HTMLDivElement>} /> : <></>}
    </div>
}

const ProfileDropdown = forwardRef<HTMLDivElement, ProfileDropdownProps>(({session}: ProfileDropdownProps, ref) => {
    const { data: notificationsData, loading, error, revalidate } = useFetchNotifications(session);

    return <div ref={ref} className={`absolute right-0 top-full bg-white rounded-xl my-2 w-max px-4 py-2 text-black flex flex-col gap-2 z-20 ${roboto.className} shadow-lg`}>
        <p className="text-base">Hi, <span className="font-semibold">{session.data?.user.name}</span></p>
        <p className="text-sm">{session.data?.user.email}</p>
        <hr></hr>
        <Link style={{textShadow: "none"}} className="text-base" href="/profile">Profile</Link>
        <Link style={{textShadow: "none"}} className="text-base" href="/">My Teams</Link>
        <Link style={{textShadow: "none"}} className="text-base" href="/notifications">Notifications { !loading ? `(${notificationsData?.length})`: <></> }</Link>
        {/* <Link style={{textShadow: "none"}} className="text-base" href="/profile/orders">Order History</Link> */}
        <hr></hr>
        <p className="hover:cursor-pointer text-base" onClick={() => signOut()}>Logout</p>
    </div>
});

ProfileDropdown.displayName = "ProfileDropdown";