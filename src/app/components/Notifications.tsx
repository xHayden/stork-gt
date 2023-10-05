'use client'

import useFetchNotifications from "@/lib/hooks";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { MdNotifications, MdOutlineNotifications } from "react-icons/md";
import { Notification, NotificationAction } from "../types";
import { BiCheck, BiX } from "react-icons/bi";
import { toast } from "react-hot-toast";

interface NotificationsTrayProps {
    notifications: Notification[];
}

const NotificationItem: React.FC<{ data: Notification }> = (n) => {
    return <div className="min-w-[16em] flex justify-between">
        <div>
            <p className="font-semibold">{n.data.title}</p>
            <p className="opacity-50">{n.data.type}</p>
        </div>
        <div className="flex flex-col">
            <p className="opacity-50">{msToString(n.data.timestamp)}</p>
            <div className="flex self-end">
                { n.data.confirmAction ? <span className="hover:cursor-pointer" onClick={() => {handleNotificationAction(n.data.confirmAction)}}><BiCheck size={25} color="green"/></span> : <></> }
                { n.data.rejectAction ? <span className="hover:cursor-pointer" onClick={() => {handleNotificationAction(n.data.rejectAction)}}><BiX size={25} color="red" /></span> : <></> }
            </div>
        </div>
    </div>
}

const toastPromiseHandle = async (route: string, args?: any) => {
    const toastPromise = new Promise(async (resolve, reject) => {
        const res = await fetch(route);
        const data = await res.json();
        if (data?.error) {
            reject(data.error);
        } else {
            resolve(data);
        }
    })
    await toastPromise;
}

const handleNotificationAction = (action: NotificationAction | null) => {
    if (!action) {
        return;
    }
    switch (action.type) {
        case "ACCEPT_INVITE": {
            toast.promise(toastPromiseHandle('/api/v1/notifications/delete/' + action.args.teamId), 
            { loading: "Accepting invite...", success: "Accepted invite from " + action.args.teamId, error: "Could not accept invite" });
            break;
        }
        case "REJECT_INVITE": {
            toast.promise(toastPromiseHandle('/api/v1/notifications/delete/' + action.args.teamId), 
            { loading: "Rejecting invite...", success: "Rejected invite from " + action.args.teamId, error: "Could not reject invite" });
            break;
        }
        case "MARK_AS_READ": {
            break;
        }
        case "OPEN_URL": {
            break;
        }
        default: {
            return;
        }
    }
}

const msToString = (time: string | number) => {
    const timeDiffInMs = new Date().getTime() - new Date(time).getTime();
    const timeDiffInMinutes = Math.floor(timeDiffInMs / (1000 * 60));
    if (timeDiffInMinutes < 1) {
        return "now";
    } else if (timeDiffInMinutes >= 1 && timeDiffInMinutes < 60) {
        return `${timeDiffInMinutes} min${timeDiffInMinutes > 1 ? 's' : ''} ago`;
    } else if (timeDiffInMinutes >= 60 && timeDiffInMinutes < 1440) {
        const hours = Math.floor(timeDiffInMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(timeDiffInMinutes / 1440);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

const NotificationsTray: React.FC<NotificationsTrayProps> = ({ notifications }) => {
    return <div className="bg-white rounded-xl my-2 w-max px-4 py-2 flex gap-2 flex-col ring-1 ring-black">
        <h3 className="text-xl border-b-2 border-red-300">Notifications ({notifications.length})</h3>
        { notifications.map((notification, index) => {
            return <NotificationItem key={index} 
                data={notification}
            />
        })}
    </div>
}

export const Notifications: React.FC = () => {
    const user = useSession();
    const [opened, setOpened] = useState(false);
    const [validData, setValidData] = useState<Notification[]>();
    const { data, loading, error } = useFetchNotifications(user);

    useEffect(() => {
        if (data?.length > 0 && data[0].typeName == "Notification") {
            setValidData(data);
        }
    }, [data, loading, error])

    return <div hidden={user.status != "authenticated"} className="rounded m-2 w-max flex flex-col transition-all">
        { (opened && validData) ? <NotificationsTray notifications={validData}/> : <></> }
        <div className="rounded-xl bg-white shadow-xl ring-1 ring-black border-black p-2 relative w-max">
            <MdNotifications size={30} color="black" onClick={() => setOpened(!opened)} />
            <div className="bg-red-500 p-[6px] border-black border-2 rounded-full w-max h-max absolute top-[4px] right-[4px]"></div>
        </div>
    </div>
}