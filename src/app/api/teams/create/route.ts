import { Team } from '@/app/types';
import client from '../../../lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from "mongodb";

/**
 * @typedef {Object} Team
 * @property {string} captain - The captain's ID.
 * @property {Array} [storks] - An optional array of stork IDs.
 * @property {Array} [members] - An optional array of member IDs.
 * @property {string} name - The team's name.
 */

/**
 * @function createTeam
 * @description This function is responsible for creating a new team in the database.
 * @param {Team} team - The new team object to be added to the database.
 * @throws Will throw an error if the team name already exists.
 * @returns {Promise} Returns a promise that resolves to the document inserted.
 */
const createTeam = async (team: Team) => {
    const dbClient = await client;
    const db = dbClient.db('stork-gt');
    const collection = db.collection('teams');
    const existingTeam = await collection.findOne({ name: team.name });
    if (existingTeam) {
        throw new Error(`Team with name ${team.name} already exists`);
    }
    const doc = await collection.insertOne(team);
    return doc;
}

/**
 * @function POST
 * @description This function handles POST requests to the /teams/create endpoint. 
 * It creates a new team by calling the createTeam function with the request body.
 * @param {NextRequest} req - The incoming request object.
 * @throws Will throw an error if the request body is missing or if the team could not be created.
 * @returns {NextResponse} The response object, including the team document inserted.
 */
export async function POST(req: NextRequest) {
    if (!req.body) {
        throw new Error("Body missing from request for /teams/create");
    }
    let data = await req.json();
    let res;
    try {
        res = await createTeam({
            captain: new ObjectId(data.captain), 
            storks: data.storks ? data.storks : [],
            members: data.members ? data.members : [new ObjectId(data.captain)],
            name: data.name,
        });
    } catch (e) {
        throw new Error("Could not create team: " + e);
    }
    return NextResponse.json(res);
}