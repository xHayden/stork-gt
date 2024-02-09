import { DBUser, User, DBTeam, DBNotification } from '@/app/types';
import client from '@/lib/mongodb'
import { Db, Collection, ObjectId } from 'mongodb';
import { ObjectNotFoundError, FailedToCreateError, FailedToDeleteError } from '@/app/types/errors';

export const deleteNotification = async (route: string, id: string) => {
    const dbClient = await client;
    const db = dbClient.db('stork-gt');
    const collection = db.collection('notifications');
    try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            throw new Error(`No notification found with id: ${id}`);
        }
        return result;
    } catch (e) {
        throw new FailedToDeleteError(route, DBNotification);
    }
}

export const getUserTeamsById = async (route: string, id: string): Promise<DBTeam[]> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBTeam> = db.collection('teams');
    const filter = { members: { $in: [new ObjectId(id)] } };
    const cursor = collection.find(filter);
    const docs: DBTeam[] = await cursor.toArray();
    if (docs.length === 0) {
        throw new ObjectNotFoundError(route, DBTeam);
    }
    return docs;
}

export const getTeamByName = async (route: string, name: string): Promise<DBTeam> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBTeam> = db.collection('teams');
    const filter = { name: { $regex: new RegExp(`^${name}$`, 'i') } };
    const doc: DBTeam | null = await collection.findOne(filter);
    if (!doc) {
        throw new ObjectNotFoundError(route, DBTeam);
    }
    return doc;
}

export const getTeamById = async (route: string, id: string): Promise<DBTeam> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBTeam> = db.collection('teams');
    const filter = { _id: new ObjectId(id) };
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

export const getUserBySlug = async (route: string, slug: string): Promise<DBUser> => {
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBUser> = db.collection('users');
    const filter = { slug: slug };
    const doc: DBUser | null = await collection.findOne(filter);
    if (!doc) {
        throw new ObjectNotFoundError(route, DBUser);
    }
    return doc;
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

export const generateSlug = async (user: User, name?: string): Promise<string> => {
    if (!name) name = user.name;
    name = name.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
    let slug = name.replace(/\s+/g, "");
    let counter = 1;
    let originalSlug = slug;
    let slugAvailable = false;

    while (!slugAvailable) {
        try {
            await getUserBySlug('User.generateSlug()', slug);
            slug = `${originalSlug}-${counter}`;
            counter++;
        } catch (error) {
            slugAvailable = true
        }
    }
    return slug;
}

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
        admin: false,
        slug: name,
    });
    user.slug = await generateSlug(user, name);
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

export const getNotificationById = async (route: string, id: string) => { 
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBNotification> = db.collection('notifications');
    const filter = { _id: new ObjectId(id) };
    const doc: DBNotification | null = await collection.findOne(filter);
    if (!doc) {
        throw new ObjectNotFoundError(route, DBNotification);
    }
    return doc;
}

export const getNotificationsByUserId = async (route: string, id: string) => { 
    const dbClient = await client;
    const db: Db = dbClient.db('stork-gt');
    const collection: Collection<DBNotification> = db.collection('notifications');
    const filter = { user: new ObjectId(id) };
    const docs: DBNotification[] = await collection.find(filter).toArray();
    if (!docs.length) {
        return [];
    }
    return docs;
}