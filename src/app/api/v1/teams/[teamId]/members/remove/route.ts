import { DBTeam } from '@/app/types';
import client from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server';
import { Db, Collection, ObjectId } from 'mongodb';
import { FailedToUpdateError, MissingRequestBodyError, MissingRequestParametersError, ObjectNotFoundError } from '@/app/types/errors';

const removeTeamMemberById = async (
  route: string,
  teamId: ObjectId,
  userId: ObjectId
): Promise<DBTeam> => {
  const dbClient = await client;
  const db: Db = dbClient.db('stork-gt');
  const collection: Collection<DBTeam> = db.collection('teams');
  const filter = { _id: teamId };
  const doc: DBTeam | null = await collection.findOne(filter);

  if (!doc) {
    throw new ObjectNotFoundError(route, DBTeam);
  }
  
  try {
    const memberIndex = doc.members.findIndex((memberId: ObjectId) =>
      memberId.equals(userId)
    );
    if (memberIndex !== -1) {
      doc.members.splice(memberIndex, 1);
      await collection.updateOne(filter, { $set: { members: doc.members } });
    }
    return doc;
  } catch (e) {
    throw new FailedToUpdateError(route, DBTeam);
  }
};

export async function POST(
  req: NextRequest,
  { params }: { params: { teamId: ObjectId } }
) {
  const route = "/api/v1/teams/${params.teamId}/members/remove";
  if (!req.body) {
    throw new MissingRequestBodyError(route);
  }
  let data = await req.json();
  if (!data.id) {
    throw new MissingRequestParametersError(route, ["id"]);
  }
  try {
    const res = await removeTeamMemberById(route, params.teamId, data.id);
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
