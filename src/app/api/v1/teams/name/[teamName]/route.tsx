import { DBTeam } from '@/app/types';
import client from '@/lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection, ObjectId } from 'mongodb';
import { ObjectNotFoundError } from '@/app/types/errors';

export const getTeamByName = async (route: string, name: string): Promise<DBTeam> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBTeam> = db.collection('teams');
    const filter = { name: name };
    const doc: DBTeam | null = await collection.findOne(filter);
    if (!doc) {
        throw new ObjectNotFoundError(route, DBTeam);
    }
    return doc;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { teamName: string } }
) {
  const route = "/api/v1/teams/name/${params.teamId}";
    try {
      const team = await getTeamByName(route, params.teamName);
      return NextResponse.json(team);
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}