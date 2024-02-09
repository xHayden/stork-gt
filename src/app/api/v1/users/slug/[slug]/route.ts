import { NextRequest, NextResponse } from "next/server";
import { getUserBySlug } from "@/lib/utils";

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
  const route = `api/v1/users/name`
  try {
    const user = await getUserBySlug(route, params.slug);
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}