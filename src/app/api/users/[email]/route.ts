import { DBUser, DatabaseObject } from '@/app/types';
import client from '../../../../lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection } from 'mongodb';
import { ObjectNotFoundError } from '@/app/types/errors';

const getUser = async (route: string, email: string): Promise<DBUser> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBUser> = db.collection('users');
    const filter = { email: email };
    const doc: DBUser | null = await collection.findOne(filter);
    if (!doc) {
        throw new ObjectNotFoundError(route, DBUser);
    }
    return doc;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { email: string } }
) {
  const route = `api/users/${params.email}`
  try {
    const user = await getUser(route, params.email);
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}