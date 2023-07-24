import { Stork } from '@/app/types';
import client from '../../../lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

const createStork = async (stork: Stork) => {
    const dbClient = await client;
    const db = dbClient.db('stork-gt');
    const collection = db.collection('storks');
    const filter = { atId: stork.atId };
    const update = {
        $setOnInsert: stork
    };
    const options = { upsert: true, returnNewDocument: true };
    const doc = await collection.findOneAndUpdate(filter, update, options);
    return doc;
}

export async function POST(req: NextRequest) {
    if (!req.body) {
        throw new Error("Body missing from request for /stork/create");
    }
    let data = await req.json();
    let res;
    try {
        res = await createStork({
            name: data.name, 
            atId: data.atId, 
            atContentURL: data.atContentURL,
            alive: data.alive, 
            lastLocation: data.lastLocation, 
            locations: data.locations, 
            trackType: data.trackType,
        });
    } catch (e) {
        throw new Error("Could not create stork: " + e);
    }
    return NextResponse.json(res);
}