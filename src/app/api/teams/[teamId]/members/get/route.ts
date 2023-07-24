import { DBTeam, DBUser } from '@/app/types';
import client from '../../../../../lib/mongodb';
import { NextRequest, NextResponse } from "next/server";
import { ObjectId, Db, Collection } from 'mongodb';

const getTeamMembersById = async (teamId: ObjectId): Promise<DBUser[]> => {
  const dbClient = await client;
  const db: Db = dbClient.db('stork-gt');
  const collection: Collection<DBTeam> = db.collection('teams');
  const filter = { _id: teamId };
  const doc: DBTeam | null = await collection.findOne(filter);

  if (!doc) {
    throw new Error('Team not found');
  }

  const memberIds = doc.members;
  const membersCollection: Collection<DBUser> = db.collection('users');
  const memberFilter = { _id: { $in: memberIds } };
  const members: DBUser[] = await membersCollection.find(memberFilter).toArray();

  return members;
};

export async function GET(
    request: NextRequest,
    { params }: { params: { teamId: ObjectId } }
) {
    try {
      const members = await getTeamMembersById(params.teamId);
      return NextResponse.json(members);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }
}