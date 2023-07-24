import { ObjectId } from "mongodb"

export interface User {
    name: string
    email: string
    dues: number
    purchases?: Item[] | []
    role: string
    admin: boolean
    paidDues?(): boolean
}

export interface DBUser extends User {
    _id: ObjectId
}

export interface Item {
    price: number
    name: number
    description?: string
    variant?: string
}

export interface Team {
    captain: ObjectId
    storks: ObjectId[]
    members: ObjectId[]
    name: string
}

export interface DBTeam extends Team {
    _id: ObjectId
}

export interface Stork {
    name: string
    alive?: boolean
    atId?: ObjectId
    atContentURL?: string
    trackType?: TrackType
    locations: TimestampPosition[]
    lastLocation?: TimestampPosition
}

export interface DBStork extends Stork {
    _id: ObjectId
}

export interface Position {
    latitude: number
    longitude: number
}

export enum TrackType {
    "two_weeks", "year"
}

export interface Timestamp {
    timestamp: Date
}

export interface TimestampPosition extends Position, Timestamp {
    
}