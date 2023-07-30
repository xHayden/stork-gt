import { MissingRequestBodyError } from '@/app/types/errors';
import { NextRequest, NextResponse } from 'next/server'
import { createUser } from "@/lib/utils";

export async function POST(req: NextRequest) {
    const route = "/api/v1/users/create"
    if (!req.body) {
        throw new MissingRequestBodyError(route);
    }
    let data = await req.json();
    let res;
    try {
        res = await createUser(route, data.name, data.email);
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
    return NextResponse.json(res);
}