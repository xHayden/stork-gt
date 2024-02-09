import { NextRequest, NextResponse } from "next/server";
import { getUserTeamsById } from "@/lib/utils";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
  const route = `api/v1/users/id/${params.id}`
  try {
    const user = await getUserTeamsById(route, params.id);
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}