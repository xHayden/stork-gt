import { DBTeam } from '@/app/types';
import client from '@/lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection, ObjectId } from 'mongodb';
import { FailedToUpdateError, MissingRequestBodyError, MissingRequestParametersError, ObjectNotFoundError } from '@/app/types/errors';

const addTeamMemberById = async (route: string, teamId: ObjectId, userId: ObjectId): Promise<DBTeam> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBTeam> = db.collection('teams');
    const filter = { _id: teamId };
    const doc: DBTeam | null = await collection.findOne(filter);
    if (!doc) {
        throw new ObjectNotFoundError(route, DBTeam);
    }
    try {
        const existingMember = doc.members.find((memberId: ObjectId) => memberId.equals(userId));
        if (existingMember) {
            return doc;
        }
        const updatedMembers: ObjectId[] = [...doc.members, userId];
        await collection.updateOne(filter, { $set: { members: updatedMembers } }); 
        return doc; 
    } catch (e) {
        throw new FailedToUpdateError(route, DBTeam);
    }
};

export async function POST(
    req: NextRequest,
    { params }: { params: { teamId: ObjectId } }
) {
    const route = "/api/v1/teams/id/${params.teamId}/members/add";
    if (!req.body) {
        throw new MissingRequestBodyError(route);
    }
    let data = await req.json();
    if (!data.id) {
        throw new MissingRequestParametersError(route, ["id"]);
    }
    let res;
    try {
        res = await addTeamMemberById(route, params.teamId, data.id);
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 400 });
    }
    return NextResponse.json(res);
}