import { DBStork } from '@/app/types';
import client from '../../../../lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection, ObjectId } from 'mongodb';

const getStorkById = async (storkId: ObjectId): Promise<DBStork> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBStork> = db.collection('storks');
    const filter = { _id: storkId };
    const doc: DBStork | null = await collection.findOne(filter);
    if (!doc) {
        return Promise.reject("Stork not found");
    }
    return doc;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { storkId: ObjectId } }
) {
    try {
      const user = await getStorkById(params.storkId);
      return NextResponse.json(user);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Stork not found" }, { status: 404 });
    }
}