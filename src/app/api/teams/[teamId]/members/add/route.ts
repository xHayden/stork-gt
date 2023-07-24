import { DBTeam } from '@/app/types';
import client from '../../../../../lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection, ObjectId } from 'mongodb';


const addTeamMemberById = async (teamId: ObjectId, userId: ObjectId): Promise<DBTeam> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBTeam> = db.collection('teams');
    const filter = { _id: teamId };
    const doc: DBTeam | null = await collection.findOne(filter);
    if (!doc) {
        return Promise.reject("Team not found");
    }
    const existingMember = doc.members.find((memberId: ObjectId) => memberId.equals(userId));
    if (existingMember) {
        return doc;
    }
    const updatedMembers: ObjectId[] = [...doc.members, userId];
    await collection.updateOne(filter, { $set: { members: updatedMembers } });
    return doc;
};

export async function POST(
    req: NextRequest,
    { params }: { params: { teamId: ObjectId } }
) {
    if (!req.body) {
        throw new Error(`Body missing from request for api/teams/${params.teamId}/members/add`);
    }
    let data = await req.json();
    if (!data.id) {
        throw new Error("Need id to add in body");
    }
    let res;
    try {
        res = await addTeamMemberById(params.teamId, data.id);
    } catch (e) {
        throw new Error("Could not add member: " + e);
    }
    return NextResponse.json(res);
}