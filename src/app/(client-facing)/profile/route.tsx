import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from "next-auth/next"
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.redirect(req.nextUrl.origin);
  }

  return NextResponse.redirect(new NextURL(`${req.nextUrl.href}/${session.user.slug}`))
}