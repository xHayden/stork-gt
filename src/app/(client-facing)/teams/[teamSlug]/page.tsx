import { DBTeam } from '@/app/types';
import TeamDashboard from './TeamDashboard';
import { getTeamByName } from '@/lib/utils';
import { redirect } from 'next/navigation';

export const revalidate = 1;

export default async function Page ({ params }: any) {
    let uri = params.teamSlug;
    try {
        uri = decodeURIComponent(uri);
    } catch (e)  {}
    try {
        const team: DBTeam = await getTeamByName(`server-side on team - ${params.teamSlug}`, uri);
        let json = JSON.stringify(team);
        params.teamSlug = uri;
        if (!team) {
            redirect("/404");
        }
        return <TeamDashboard params={{...params, team: json}} />
    } catch (e) {
        redirect('/404');
    }
}