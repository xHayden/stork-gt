import { getTeams } from '@/app/api/v1/teams/route';
import { DBTeam } from '@/app/types';
import type {
    GetStaticPaths
} from 'next'
import TeamDashboard from './TeamDashboard';

export default function Page ({ params }: any) {
    return <TeamDashboard params={params} />
}

export const getStaticPaths = (async () => {
    const teams: DBTeam[] = await getTeams("internal getStaticPaths on team page");

    const teamPaths = teams.map((team) => ({
        params: { teamSlug: encodeURIComponent(team.name) }
    }))

    return { 
        paths: teamPaths,
        fallback: true
    }
}) satisfies GetStaticPaths