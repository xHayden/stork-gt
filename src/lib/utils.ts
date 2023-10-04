import { DBUser, User, DBTeam } from '@/app/types';
import client from '@/lib/mongodb'
import { Db, Collection, ObjectId } from 'mongodb';
import { ObjectNotFoundError, FailedToCreateError } from '@/app/types/errors';

export const getTeamByName = async (route: string, name: string): Promise<DBTeam> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBTeam> = db.collection('teams');
    const filter = { name: name };
    const doc: DBTeam | null = await collection.findOne(filter);
    if (!doc) {
        throw new ObjectNotFoundError(route, DBTeam);
    }
    return doc;
}

export const getTeams = async (route: string): Promise<DBTeam[]> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBTeam> = db.collection('teams');
    const filter = {};
    const cursor = collection.find(filter);
    const docs: DBTeam[] = await cursor.toArray();
    if (docs.length === 0) {
        throw new ObjectNotFoundError(route, DBTeam);
    }
    return docs;
}

export const searchUserByName = async (route: string, nameStart: string): Promise<DBUser[]> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBUser> = db.collection('users');
    const regex = new RegExp(`^${nameStart}`, 'i');
    const filter = { name: regex };
    const docs: DBUser[] = await collection.find(filter).limit(10).toArray();
    if (!docs.length) {
        throw new ObjectNotFoundError(route, DBUser);
    }
    return docs;
}


export const getUserById = async (route: string, id: string): Promise<DBUser> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBUser> = db.collection('users');
    const filter = { _id: new ObjectId(id) };
    const doc: DBUser | null = await collection.findOne(filter);
    if (!doc) {
        throw new ObjectNotFoundError(route, DBUser);
    }
    return doc;
}

export const getUsersByName = async (route: string, name: string): Promise<DBUser[]> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBUser> = db.collection('users');
    const filter = {};
    const cursor = collection.find(filter);
    const docs: DBUser[] = await cursor.toArray();
    if (docs.length === 0) {
        throw new ObjectNotFoundError(route, DBUser);
    }
    return docs;
}

export const getUserByEmail = async (route: string, email: string): Promise<DBUser> => {
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

if (!process.env.DEFAULT_DUES){
    throw new Error("DEFAULT_DUES not in .env");
}
const dues: number = Number(process.env.DEFAULT_DUES);

export const createUser = async (route: string, name: string, email: string) => {
    const dbClient = await client;
    const db = dbClient.db('stork-gt');
    const collection = db.collection('users');
    const filter = { email: email };
    const user: User = new User({
        name: name,
        email: email,
        dues: dues,
        role: "Member",
        admin: false
    });
    const update = {
        $setOnInsert: user
    };
    const options = { upsert: true, returnNewDocument: true };
    try {
        const doc = await collection.findOneAndUpdate(filter, update, options);
        return doc;
    } catch (e) {
        throw new FailedToCreateError(route, DBUser);
    }
}