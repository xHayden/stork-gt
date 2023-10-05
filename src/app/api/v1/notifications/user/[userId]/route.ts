import { NextRequest, NextResponse } from "next/server";
import { getNotificationsByUserId } from "@/lib/utils";

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
  const route = `api/v1/notifications/user/${params.userId}`
  try {
    const user = await getNotificationsByUserId(route, params.userId);
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}