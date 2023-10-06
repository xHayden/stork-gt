import { DBTeam, Team } from '@/app/types';
import client from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from "mongodb";
import { AlreadyExistsError, FailedToCreateError, MissingRequestBodyError, MissingRequestParametersError } from '@/app/types/errors';

const createTeam = async (route: string, team: Team) => {
    const dbClient = await client;
    const db = dbClient.db('stork-gt');
    const collection = db.collection('teams');
    const existingTeam = await collection.findOne({ name: team.name });
    if (existingTeam) {
        throw new AlreadyExistsError(route, team);
    }
    try {
        const doc = await collection.insertOne(team);
        return doc;
    } catch (e) {
        throw new FailedToCreateError(route, DBTeam);
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    const route = 'api/v1/teams/create'
    if (!req.body) {
        throw new MissingRequestBodyError(route);
    }
    let data = await req.json();
    let missing = [];
    if (!data.captain) {
        missing.push("captain");
    }
    if (!data.name) {
        missing.push("name");
    }
    if (missing.length > 0) {
        throw new MissingRequestParametersError(route, missing);
    }
    
    try {
        const res = await createTeam(route, new Team({
            captain: new ObjectId(data.captain), 
            storks: data.storks ? data.storks : [],
            members: data.members ? data.members : [new ObjectId(data.captain)],
            name: data.name,
        }));
        return NextResponse.json(res);
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}