import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserBySlug, getUserTeamsById } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CreateTeamInput, JoinTeamInput } from "./JoinCreateTeam";

const ProfilePage = async ({ params }: { params: { profileSlug: string } }) => {
    const session = await getServerSession(authOptions);
    let user, teams;
    try {
        user = await getUserBySlug(`/profile/${params.profileSlug}/`, params.profileSlug);
    } catch (e) {
        redirect('/profile');
    }
    try {
        teams = await getUserTeamsById('/profile/${params.profileSlug}/', user._id.toString());
    } catch (e) {
        
    }

    return <div className="flex w-full justify-center mx-2">
        <div className="md:max-w-[70em] 2xl:max-w-[100em] w-full rounded">
            <div className="bg-gradient-to-tr from-amber-100 to-amber-300 py-4 px-6 rounded-t-2xl flex flex-row min-h-[10rem] justify-between">
                <div className="flex flex-col gap-1 justify-end">
                    <h1 className="text-xl font-semibold text-slate-800">{user.name}</h1>
                    <h2 className="text-sm text-slate-700 font-light">@{user.slug}</h2>
                </div>
                <div className="text-2xl text-slate-700">
                    #0
                </div>
            </div>
            <div className="px-6 bg-slate-800 text-white py-4">
                <h3 className="text-lg font-bold">Teams</h3>
                <div className="p">
                    { teams ? teams?.map(team => {
                        return <div key={team._id.toString()}>
                            <p className="text-lg font-semibold">{team.name}</p>
                            <div className="">
                                <p>{team.members.map(member => {
                                    return member.toString();
                                })}</p>
                            </div>
                        </div>
                    }): <div>
                        <p>You haven&apos;t joined a team yet. Would you like to request an invite to join one?</p>
                    </div> }
                    <JoinTeamInput />
                    { user.admin ? <div>
                    <p>Since you&apos;re an admin, you can create a team.</p>
                    <CreateTeamInput />
                    </div> : <></> }
                </div>
            </div>
            <div>
                <h3>History</h3>
            </div>
        </div>
    </div>
}

export default ProfilePage;