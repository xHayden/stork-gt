import { NextRequest, NextResponse } from "next/server";
import { getTeamById } from '@/lib/utils';

export async function GET(
    request: NextRequest,
    { params }: { params: { teamId: string } }
) {
  const route = `/api/v1/teams/id/${params.teamId}`;
    try {
      const team = await getTeamById(route, params.teamId);
      return NextResponse.json(team);
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}