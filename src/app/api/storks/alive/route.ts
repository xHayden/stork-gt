import { DBStork } from '@/app/types';
import client from '../../../lib/mongodb'
import { NextRequest, NextResponse } from "next/server";
import { Db, Collection } from 'mongodb';

const getStorksAlive = async (): Promise<DBStork[]> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBStork> = db.collection('storks');
    const filter = { alive: true };
    const cursor = collection.find(filter);
    const docs: DBStork[] = await cursor.toArray();
    if (docs.length === 0) {
        throw new Error("Storks not found");
    }
    return docs;
}

export async function GET(
    request: NextRequest
) {
    try {
      const storks = await getStorksAlive();
      return NextResponse.json(storks);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error }, { status: 400 });
    }
}