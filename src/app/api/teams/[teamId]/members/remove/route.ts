import { DBTeam } from '@/app/types';
import client from '../../../../../lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { Db, Collection, ObjectId } from 'mongodb';

const removeTeamMemberById = async (
  teamId: ObjectId,
  userId: ObjectId
): Promise<DBTeam> => {
  const dbClient = await client;
  const db: Db = dbClient.db('stork-gt');
  const collection: Collection<DBTeam> = db.collection('teams');
  const filter = { _id: teamId };
  const doc: DBTeam | null = await collection.findOne(filter);

  if (!doc) {
    return Promise.reject('Team not found');
  }
  
  const memberIndex = doc.members.findIndex((memberId: ObjectId) =>
    memberId.equals(userId)
  );
  if (memberIndex !== -1) {
    doc.members.splice(memberIndex, 1);
    await collection.updateOne(filter, { $set: { members: doc.members } });
  }
  return doc;
};

export async function POST(
  req: NextRequest,
  { params }: { params: { teamId: ObjectId } }
) {
  if (!req.body) {
    throw new Error(
      `Body missing from request for api/teams/${params.teamId}/members/remove`
    );
  }

  let data = await req.json();
  let res;
  try {
    res = await removeTeamMemberById(params.teamId, data.id);
  } catch (e) {
    throw new Error('Could not remove member: ' + e);
  }

  return NextResponse.json(res);
}
