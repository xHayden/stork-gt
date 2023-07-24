import { User } from '@/app/types';
import client from '../../../lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

if (!process.env.DEFAULT_DUES){
    throw new Error("DEFAULT_DUES not in .env");
}
const dues: number = Number(process.env.DEFAULT_DUES);

const createUser = async (name: string, email: string) => {
    const dbClient = await client;
    const db = dbClient.db('stork-gt');
    const collection = db.collection('users');
    const filter = { email: email };
    const user: User = {
        name: name,
        email: email,
        dues: dues,
        role: "Member",
        admin: false
    }
    const update = {
        $setOnInsert: user
    };
    const options = { upsert: true, returnNewDocument: true };
    const doc = await collection.findOneAndUpdate(filter, update, options);
    return doc;
}

export async function POST(req: NextRequest) {
    if (!req.body) {
        throw new Error("Body missing from request for /user/create");
    }
    let data = await req.json();
    let res;
    try {
        res = await createUser(data.name, data.email);
    } catch (e) {
        throw new Error("Could not create user: " + e);
    }
    return NextResponse.json(res);
}