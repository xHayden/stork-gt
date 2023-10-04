import { NextRequest, NextResponse } from "next/server";
import { searchUserByName } from "@/lib/utils";

export async function GET(
    request: NextRequest
) {
  const route = `api/v1/users/name`
  try {
    const user = await searchUserByName(route, "");
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}