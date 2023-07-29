import { DBTeam, DBUser, DatabaseObject } from '@/app/types';
import client from '@/lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { ObjectId, Db, Collection } from 'mongodb';
import { ObjectNotFoundError } from '@/app/types/errors';

const getTeamMembersById = async (route: string, teamId: ObjectId): Promise<DBUser[]> => {
  const dbClient = await client;
  const db: Db = dbClient.db('stork-gt');
  const collection: Collection<DBTeam> = db.collection('teams');
  const filter = { _id: teamId };
  const doc: DBTeam | null = await collection.findOne(filter);

  if (!doc) {
    throw new ObjectNotFoundError(route, DBTeam);
  }
  try {
    const memberIds = doc.members;
    const membersCollection: Collection<DBUser> = db.collection('users');
    const memberFilter = { _id: { $in: memberIds } };
    const members: DBUser[] = await membersCollection.find(memberFilter).toArray();
    return members;
  } catch (e) {
    throw new ObjectNotFoundError(route, DBUser);
  }
};

export async function GET(
    request: NextRequest,
    { params }: { params: { teamId: ObjectId } }
) {
    const route = "/api/v1/teams/${params.teamId}/members/get";
    try {
      const members = await getTeamMembersById(route, params.teamId);
      return NextResponse.json(members);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}