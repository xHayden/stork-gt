import { DBTeam } from '@/app/types';
import client from '../../../lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection, ObjectId } from 'mongodb';

const getTeamByName = async (name: string): Promise<DBTeam> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBTeam> = db.collection('teams');
    const filter = { name: name };
    const doc: DBTeam | null = await collection.findOne(filter);
    if (!doc) {
        return Promise.reject("Team not found");
    }
    return doc;
}

const getTeamById = async (id: ObjectId): Promise<DBTeam> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBTeam> = db.collection('teams');
    const filter = { _id: id };
    const doc: DBTeam | null = await collection.findOne(filter);
    if (!doc) {
        return Promise.reject("Team not found");
    }
    return doc;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { teamId: ObjectId } }
) {
    try {
      const team = await getTeamById(params.teamId);
      return NextResponse.json(team);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
}