import { DBStork } from '@/app/types';
import client from '../../../../../lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection, ObjectId } from 'mongodb';
import { ObjectNotFoundError } from '@/app/types/errors';

const getStorkByName = async (route: string, storkName: string): Promise<DBStork> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBStork> = db.collection('storks');
    const filter = { name: storkName };
    const doc: DBStork | null = await collection.findOne(filter);
    if (!doc) {
        throw new ObjectNotFoundError(route, DBStork);
    }
    return doc;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { storkName: string } }
) {
  const route = `api/storks/id/${params.storkName}`
    try {
      const user = await getStorkByName(route, params.storkName);
      return NextResponse.json(user);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}