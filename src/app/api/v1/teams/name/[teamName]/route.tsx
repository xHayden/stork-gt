import { NextRequest, NextResponse } from "next/server";
import { getTeamByName } from '@/lib/utils';

export async function GET(
    request: NextRequest,
    { params }: { params: { teamName: string } }
) {
  const route = `/api/v1/teams/name/${params.teamName}`;
    try {
      let uri = params.teamName;
      try {
        uri = decodeURIComponent(uri);
      } catch (e) {
        
      }
      const team = await getTeamByName(route, uri);
      return NextResponse.json(team);
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}