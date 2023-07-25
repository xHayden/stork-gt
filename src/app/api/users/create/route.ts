import { DBUser, DatabaseObject, User } from '@/app/types';
import client from '../../../../lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { FailedToCreateError, MissingRequestBodyError } from '@/app/types/errors';

if (!process.env.DEFAULT_DUES){
    throw new Error("DEFAULT_DUES not in .env");
}
const dues: number = Number(process.env.DEFAULT_DUES);

const createUser = async (route: string, name: string, email: string) => {
    const dbClient = await client;
    const db = dbClient.db('stork-gt');
    const collection = db.collection('users');
    const filter = { email: email };
    const user: User = new User({
        name: name,
        email: email,
        dues: dues,
        role: "Member",
        admin: false
    });
    const update = {
        $setOnInsert: user
    };
    const options = { upsert: true, returnNewDocument: true };
    try {
        const doc = await collection.findOneAndUpdate(filter, update, options);
        return doc;
    } catch (e) {
        throw new FailedToCreateError(route, DBUser);
    }
}

export async function POST(req: NextRequest) {
    const route = "api/users/create"
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