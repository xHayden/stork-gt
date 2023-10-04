import { DBTeam } from '@/app/types';
import client from '@/lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection } from 'mongodb';
import { ObjectNotFoundError } from '@/app/types/errors';

export const getTeams = async (route: string): Promise<DBTeam[]> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBTeam> = db.collection('teams');
    const filter = {};
    const cursor = collection.find(filter);
    const docs: DBTeam[] = await cursor.toArray();
    if (docs.length === 0) {
        throw new ObjectNotFoundError(route, DBTeam);
    }
    return docs;
}

export async function GET(
    request: NextRequest
) {
  const route = "/api/v1/teams"
    try {
      const storks = await getTeams(route);
      return NextResponse.json(storks);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}