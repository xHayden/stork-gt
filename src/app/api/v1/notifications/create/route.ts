import { DBNotification, Notification, isValidAction } from '@/app/types';
import client from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server';
import { FailedToCreateError, MissingRequestBodyError, MissingRequestParametersError } from '@/app/types/errors';
import { ObjectId } from 'mongodb';

const createNotification = async (route: string, notification: Notification) => {
    const dbClient = await client;
    const db = dbClient.db('stork-gt');
    const collection = db.collection('notifications');
    try {
        notification.user = new ObjectId(notification.user);
        const doc = await collection.insertOne(notification);
        return doc;
    } catch (e) {
        throw new FailedToCreateError(route, DBNotification);
    }
}

export async function POST(req: NextRequest) {
    const route = 'api/v1/notifications/create'
    if (!req.body) {
        throw new MissingRequestBodyError(route);
    }
    let data = await req.json();
    let missing = [];
    if (!data.title) {
        missing.push("title");
    }
    if (!data.message) {
        missing.push("message");
    }
    if (!data.type) {
        missing.push("type");
    }
    if (!data.user) {
        missing.push("user")
    }
    if (!data.confirmAction || !isValidAction(data.confirmAction)) {
        missing.push("confirmAction")
    }
    if (!data.rejectAction || !isValidAction(data.rejectAction)) {
        missing.push("rejectAction")
    }
    if (missing.length > 0) {
        throw new MissingRequestParametersError(route, missing);
    }
    try {
        const res = await createNotification(route, new Notification({ 
            title: data.title,
            message: data.message,
            // @ts-ignore
            timestamp: new Date(),
            type: data.type,
            read: false,
            user: data.user,
            rejectAction: JSON.parse(data.rejectAction) ?? null,
            confirmAction: JSON.parse(data.confirmAction) ?? null,
        }));
        return NextResponse.json(res);
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 400 })
    }
}