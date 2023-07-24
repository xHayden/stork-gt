import { DBUser } from '@/app/types';
import client from '../../../lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection } from 'mongodb';

const getUser = async (email: string): Promise<DBUser> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBUser> = db.collection('users');
    const filter = { email: email };
    const doc: DBUser | null = await collection.findOne(filter);
    if (!doc) {
        return Promise.reject("User not found");
    }
    return doc;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { email: string } }
) {
    try {
      const user = await getUser(params.email);
      return NextResponse.json(user);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
}