import { DBTeam } from '@/app/types';
import TeamDashboard from './TeamDashboard';
import { getTeamByName } from '@/lib/utils';

export default async function Page ({ params }: any) {
    const team: DBTeam = await getTeamByName(`server-side on team - ${params.teamSlug}`, params.teamSlug);
    let json = JSON.stringify(team);
    return <TeamDashboard params={{...params, team: json}} />
}