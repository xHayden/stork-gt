import { DBStork } from '@/app/types';
import client from '../../../../lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection } from 'mongodb';
import { ObjectNotFoundError } from '@/app/types/errors';

const getStorksAlive = async (route: string): Promise<DBStork[]> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBStork> = db.collection('storks');
    const filter = { alive: true };
    const cursor = collection.find(filter);
    const docs: DBStork[] = await cursor.toArray();
    if (docs.length === 0) {
        throw new ObjectNotFoundError(route, DBStork);
    }
    return docs;
}

export async function GET(
    request: NextRequest
) {
  const route = "/api/storks/alive"
    try {
      const storks = await getStorksAlive(route);
      return NextResponse.json(storks);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}