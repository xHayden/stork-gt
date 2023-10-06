import { DBStork } from '@/app/types';
import client from '@/lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection } from 'mongodb';
import { ObjectNotFoundError } from '@/app/types/errors';

const getStorksByName = async (route: string, storkName: string): Promise<DBStork[]> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBStork> = db.collection('storks');
    const regex = new RegExp(`^${storkName}`, 'i');
    const filter = { name: regex };
    const docs: DBStork[] = await collection.find(filter).toArray();
    if (!docs.length) {
        throw new ObjectNotFoundError(route, DBStork);
    }
    return docs;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { storkName: string } }
) {
  const route = `api/v1/storks/id/${params.storkName}`
    try {
      const user = await getStorksByName(route, params.storkName);
      return NextResponse.json(user);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}