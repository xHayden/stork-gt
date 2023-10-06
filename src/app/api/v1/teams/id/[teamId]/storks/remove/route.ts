import { DBTeam } from '@/app/types';
import client from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server';
import { Db, Collection, ObjectId } from 'mongodb';
import { FailedToUpdateError, MissingRequestBodyError, MissingRequestParametersError, ObjectNotFoundError } from '@/app/types/errors';

const removeStorkFromTeamById = async (
  route: string,
  teamId: string,
  storkId: string
): Promise<DBTeam> => {
  const dbClient = await client;
  const db: Db = dbClient.db('stork-gt');
  const collection: Collection<DBTeam> = db.collection('teams');
  const filter = { _id: new ObjectId(teamId) };
  const doc: DBTeam | null = await collection.findOne(filter);

  if (!doc) {
    throw new ObjectNotFoundError(route, DBTeam);
  }
  
  try {
    const storkIndex = doc.storks?.findIndex((id: ObjectId) =>
      id.equals(new ObjectId(storkId))
    );
    if (storkIndex !== -1) {
      doc.storks?.splice(storkIndex, 1);
      await collection.updateOne(filter, { $set: { storks: doc.storks } });
    }
    return doc;
  } catch (e) {
    throw new FailedToUpdateError(route, DBTeam);
  }
};

export async function POST(
  req: NextRequest,
  { params }: { params: { teamId: string } }
) {
  const route = `/api/v1/teams/${params.teamId}/storks/remove`;
  if (!req.body) {
    throw new MissingRequestBodyError(route);
  }
  let data = await req.json();
  if (!data.id) {
    throw new MissingRequestParametersError(route, ["id"]);
  }
  try {
    const res = await removeStorkFromTeamById(route, params.teamId, data.id);
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}