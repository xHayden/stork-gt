import { NextRequest, NextResponse } from "next/server";
import { deleteNotification } from "@/lib/utils";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
  const route = `api/v1/notifications/delete/${params.id}`
  try {
    const notification = await deleteNotification(route, params.id);
    return NextResponse.json(notification);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}