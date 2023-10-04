import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/utils";

export async function GET(
    request: NextRequest,
    { params }: { params: { email: string } }
) {
  const route = `api/v1/users/email/${params.email}`
  try {
    const user = await getUserByEmail(route, params.email);
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}