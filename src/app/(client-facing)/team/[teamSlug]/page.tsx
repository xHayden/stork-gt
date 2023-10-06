import { DBTeam } from '@/app/types';
import TeamDashboard from './TeamDashboard';
import { getTeamByName } from '@/lib/utils';

export default async function Page ({ params }: any) {
    let uri = params.teamSlug;
    try {
        uri = decodeURIComponent(uri);
    } catch (e)  {}
    const team: DBTeam = await getTeamByName(`server-side on team - ${params.teamSlug}`, uri);
    let json = JSON.stringify(team);
    params.teamSlug = uri;
    return <TeamDashboard params={{...params, team: json}} />
}