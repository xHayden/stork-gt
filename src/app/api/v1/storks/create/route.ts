import { DBStork, Stork } from '@/app/types';
import client from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { FailedToCreateError, MissingRequestBodyError, MissingRequestParametersError } from '@/app/types/errors';

const createStork = async (route: string, stork: Stork) => {
    const dbClient = await client;
    const db = dbClient.db('stork-gt');
    const collection = db.collection('storks');
    const filter = { atId: stork.atId };
    const update = {
        $setOnInsert: stork
    };
    const options = { upsert: true, returnNewDocument: true };
    try {
        const doc = await collection.findOneAndUpdate(filter, update, options);
        return doc;
    } catch (e) {
        throw new FailedToCreateError(route, DBStork);
    }
}

export async function POST(req: NextRequest) {
  const route = "/api/v1/storks/create";
    if (!req.body) {
        throw new MissingRequestBodyError(route);
    }
    let data = await req.json();
    let missing = [];
    if (!data.name) {
        missing.push("name");
    }
    if (!data.atId) {
        missing.push("atId");
    }
    if (!data.atContentURL) {
        missing.push("atContentURL");
    }
    if (!data.alive) {
        missing.push("alive");
    }
    if (!data.lastLocation) {
        data.push("lastLocation");
    }
    if (!data.locations) {
        data.push("locations");
    }
    if (!data.trackType) {
        data.push("trackType");
    }
    if (missing.length > 0) {
        throw new MissingRequestParametersError(route, missing);
    }
    let res;
    try {
        res = await createStork(route, new Stork({
            name: data.name, 
            atId: data.atId, 
            atContentURL: data.atContentURL,
            alive: data.alive, 
            lastLocation: data.lastLocation, 
            locations: data.locations, 
            trackType: data.trackType,
        }));
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
    return NextResponse.json(res);
}