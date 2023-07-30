import { ObjectId } from "mongodb";

export class DatabaseObject implements IDatabaseObject {
    typeName: string;
    constructor(typeName: string) {
        this.typeName = typeName;
    }
}

export type IDatabaseObject = {
    typeName: string
}

export interface IUser {
    name: string;
    email: string;
    dues: number;
    purchases?: IItem[] | [];
    role: string;
    admin: boolean;
    paidDues?(): boolean;
}

export class User extends DatabaseObject implements IUser {
    name!: string;
    email!: string;
    dues!: number;
    purchases?: IItem[] | [];
    role!: string;
    admin!: boolean;
    constructor(user: IUser) {
        super("User");
        Object.assign(this, user);
    }
    paidDues(): boolean {
        return (this.dues <= 0);
    }
}

export interface IDBUser extends IUser, IDatabaseObject {
    _id: ObjectId;
}

export class DBUser extends User implements IDBUser, IDatabaseObject {
    static typeName = "DBUser";
    _id: ObjectId
    constructor(_id: ObjectId, user: IUser) {
        super(user);
        this._id = _id;
    }
}

export interface IItem {
    price: number;
    name: number;
    description?: string;
    variant?: string;
}

export class Item extends DatabaseObject implements IItem {
    price!: number;
    name!: number;
    description?: string;
    variant?: string;
    constructor(item: IItem) {
        super("Item");
        Object.assign(this, item);
    }
}

export interface ITeam {
    captain: ObjectId;
    storks: ObjectId[];
    members: ObjectId[];
    name: string;
}

export class Team extends DatabaseObject implements ITeam {
    captain!: ObjectId;
    storks!: ObjectId[];
    members!: ObjectId[];
    name!: string;
    constructor(team: ITeam) {
        super("Team");
        Object.assign(this, team);
    }
}

export interface IDBTeam extends ITeam, IDatabaseObject {
    _id: ObjectId;
}

export class DBTeam extends Team implements IDBTeam {
    static typeName = "DBTeam";
    _id: ObjectId;
    constructor(_id: ObjectId, team: ITeam) {
        super(team);
        this._id = _id;
    }
}

export interface IStork {
    name: string;
    alive?: boolean;
    atId?: ObjectId;
    atContentURL?: string;
    trackType?: TrackType;
    locations: TimestampPosition[];
    lastLocation?: TimestampPosition;
}

export class Stork extends DatabaseObject implements IStork {
    name!: string;
    alive?: boolean;
    atId?: ObjectId;
    atContentURL?: string;
    trackType?: TrackType;
    locations!: TimestampPosition[];
    lastLocation?: TimestampPosition;
    constructor(stork: IStork) {
        super("Stork");
        Object.assign(this, stork);
    }
}

export interface IDBStork extends IStork, IDatabaseObject {
    _id: ObjectId;
}

export class DBStork extends Stork implements IDBStork {
    static typeName = "DBStork";
    _id: ObjectId
    constructor(_id: ObjectId, stork: IStork) {
        super(stork);
        this._id = _id;
    }
}

export interface Position {
    latitude: number;
    longitude: number;
}

export enum TrackType {
    "two_weeks", "year"
}

export interface Timestamp {
    timestamp: Date;
}

export interface TimestampPosition extends Position, Timestamp {
    
}

interface ComboboxProps {
    elements: any[]
}

export interface APINameComboboxProps extends ComboboxProps {
    elements: APIForm[]
    setSelected: any
    selected: APIForm | undefined
    visible: APIForm[]
    setVisible: any
}

export interface APIFormField {
    name: string
    type: string
    placeholder: string
}

export interface APIForm {
    name: string
    requestUrl: string
    requestMethod: string
    buttonText: string
    description?: string
    fields: APIFormField[]
}