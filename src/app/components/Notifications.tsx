'use client'

import { useFetchNotifications } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import { MdNotifications, MdOutlineNotifications } from "react-icons/md";
import { DBNotification, Notification, NotificationAction } from "../types";
import { BiCheck, BiX } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { Session } from "next-auth";

interface NotificationsTrayProps {
    notifications: (Notification & { _id: string })[];
    revalidate: () => Promise<(Notification & { _id: string })[]>;
}

interface NotificationItemProps {
    n: Notification & { _id: string };
    revalidate: () => Promise<(Notification & { _id: string })[]>;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ n, revalidate }) => {
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const { data: session } = useSession();

    return <div className="min-w-[16em] flex justify-between">
        <div>
            <p className="font-semibold">{n.title}</p>
            <p className="opacity-50">{n.message}</p>
        </div>
        <div className="flex flex-col">
            <p className="opacity-50 self-end">{msToString(n.timestamp)}</p>
            <div className="flex self-end">
                { n.confirmAction ? <span className={`hover:cursor-pointer ${loadingConfirm ? "animate-spin" : ""}`} onClick={() => {
                    setLoadingConfirm(true);
                    handleNotificationAction(n.confirmAction, n._id, revalidate, session)
                }}><BiCheck size={25} color="green"/></span> : <></> }
                { n.rejectAction ? <span className={`hover:cursor-pointer ${loadingReject ? "animate-spin" : ""}`} onClick={() => {
                    setLoadingReject(true);
                    handleNotificationAction(n.rejectAction, n._id, revalidate, session)}
                }><BiX size={25} color="red"/></span> : <></> }
            </div>
        </div>
    </div>
}

const toastPromiseHandle = async (route: string, revalidate: () => Promise<(Notification & { _id: string })[]>, callback?: () => void, args?: any) => {
    const toastPromise = new Promise(async (resolve, reject) => {
        const res = await fetch(route);
        const data = await res.json();
        if (data?.error) {
            reject(data.error);
        } else {
            // signal revalidation of notifications list
            await revalidate();
            resolve(data);
        }
    })
    await toastPromise;
}

const handleNotificationAction = (action: NotificationAction | null, notificationId: string, revalidate: () => Promise<(Notification & { _id: string })[]>, session: Session | undefined | null) => {
    if (!action) {
        return;
    }
    switch (action.type) {
        case "ACCEPT_INVITE": {
            if (!session) {
                console.log("Invalid session");
                return;
            }
            toast.promise(toastPromiseHandle('/api/v1/notifications/delete/' + notificationId, revalidate, async () => {
                // accept invite, lol security is lame
                const response = await fetch(`/api/v1/teams/${action.args.teamId}/members/add`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify(
                        {
                            "id": session.user._id
                        }
                    ),
                  });
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
            }), 
            { loading: "Accepting invite...", success: "Accepted invite from " + action.args.teamId, error: "Could not accept invite" });
            break;
        }
        case "REJECT_INVITE": {
            if (!session) {
                console.log("Invalid session");
                return;
            }
            toast.promise(toastPromiseHandle('/api/v1/notifications/delete/' + notificationId, revalidate), 
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

const NotificationsTray: React.FC<NotificationsTrayProps> = ({ notifications, revalidate }) => {
    return <div className="bg-white rounded-xl my-2 w-max px-4 py-2 flex gap-2 flex-col ring-1 ring-black">
        <h3 className="text-xl border-b-2 border-red-300">Notifications ({notifications.length})</h3>
        { notifications.map((notification, index) => {
            return <NotificationItem key={notification._id} 
                n={notification}
                revalidate={revalidate}
            />
        })}
    </div>
}

export const Notifications: React.FC = () => {
    const user = useSession();
    const [opened, setOpened] = useState(false);
    const [validData, setValidData] = useState<(Notification & { _id: string })[]>([]);
    const { data, loading, error, revalidate } = useFetchNotifications(user);

    useEffect(() => {
        if (data?.length > 0 && data[0].typeName == "Notification") {
            setValidData(data);
        } else if (data?.length == 0) {
            setValidData([]);
        }
    }, [data, loading, error])

    return user.status == "authenticated" ? <div className="rounded m-2 w-max flex flex-col transition-all">
        { (opened && validData.length != 0) ? <NotificationsTray notifications={validData} revalidate={revalidate}/> : <></> }
        <div className="rounded-xl bg-white shadow-xl ring-1 ring-black border-black p-2 relative w-max group hover:scale-105 transition-all">
            <MdNotifications size={30} color="black" onClick={() => setOpened(!opened)} />
            <div className="bg-red-500 p-[6px] border-black border-2 rounded-full w-max h-max absolute top-[4px] right-[4px]" hidden={validData.length == 0}></div>
        </div>
    </div> : <></>
}