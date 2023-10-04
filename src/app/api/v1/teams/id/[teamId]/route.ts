import { DBTeam } from '@/app/types';
import client from '@/lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection, ObjectId } from 'mongodb';
import { ObjectNotFoundError } from '@/app/types/errors';

const getTeamById = async (route: string, id: ObjectId): Promise<DBTeam> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBTeam> = db.collection('teams');
    const filter = { _id: id };
    const doc: DBTeam | null = await collection.findOne(filter);
    if (!doc) {
        throw new ObjectNotFoundError(route, DBTeam);
    }
    return doc;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { teamId: ObjectId } }
) {
  const route = "/api/v1/teams/id/${params.teamId}";
    try {
      const team = await getTeamById(route, params.teamId);
      return NextResponse.json(team);
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}