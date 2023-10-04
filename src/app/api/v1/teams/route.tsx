import { getTeams } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest
) {
  const route = "/api/v1/teams"
    try {
      const storks = await getTeams(route);
      return NextResponse.json(storks);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}