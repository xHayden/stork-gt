import { DBUser, User } from '@/app/types';
import client from '@/lib/mongodb'
import { Db, Collection } from 'mongodb';
import { ObjectNotFoundError, FailedToCreateError } from '@/app/types/errors';

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