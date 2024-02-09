import { NotificationsPageList } from "@/app/components/Notifications";
import { getNotificationsByUserId } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const NotificationsPage = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user._id) {
        console.log(session)
        redirect('/');
    }
    const notificiations = await getNotificationsByUserId('get notifications server-side notifications page', session?.user._id.toString());
    return <div>
        <NotificationsPageList notifications={notificiations} />
    </div>
}

export default NotificationsPage;