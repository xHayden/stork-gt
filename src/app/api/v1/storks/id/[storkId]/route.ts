import { DBStork } from '@/app/types';
import client from '@/lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection, ObjectId } from 'mongodb';
import { ObjectNotFoundError } from '@/app/types/errors';

const getStorkById = async (route: string, storkId: string): Promise<DBStork> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBStork> = db.collection('storks');
    const filter = { _id: new ObjectId(storkId) };
    const doc: DBStork | null = await collection.findOne(filter);
    if (!doc) {
        throw new ObjectNotFoundError(route, DBStork);
    }
    return doc;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { storkId: string } }
) {
    const route = `api/v1/storks/id/${params.storkId}`
    try {
      const user = await getStorkById(route, params.storkId);
      return NextResponse.json(user);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}