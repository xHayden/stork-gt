import { DatabaseObject } from ".";

export class APIRequestError extends Error {
    route: string
    constructor(route: string, message: string) {
        super(message);
        this.route = route;
    }
}

export class MissingRequestParametersError extends APIRequestError {
    missingArgs: string[]
    constructor(route: string, missingArgs: string[]) {
        super(route, JSON.stringify(missingArgs));
        this.missingArgs = missingArgs;
    }
}

export class MissingRequestBodyError extends APIRequestError {
    constructor(route: string) {
        super(route, "Missing body in request.");
    }
}

export class FailedToCreateError extends APIRequestError {
    constructor(route: string, type: any) {
        if (!type?.typeName) {
            throw new Error("Illegal error creation, missing typeName.");
        }
        super(route, "Failed to create: " + typeof(type));
    }
}

export class FailedToDeleteError extends APIRequestError {
    constructor(route: string, type: any) {
        if (!type?.typeName) {
            throw new Error("Illegal error creation, missing typeName.");
        }
        super(route, "Failed to delete: " + typeof(type));
    }
}

export class AlreadyExistsError extends APIRequestError {
    constructor(route: string, type: any) {
        if (!type?.typeName) {
            throw new Error("Illegal error creation, missing typeName.");
        }
        super(route, "Failed to create: " + typeof(type) + " already exists");
    }
}

export class FailedToUpdateError extends APIRequestError {
    constructor(route: string, type: any) {
        if (!type?.typeName) {
            throw new Error("Illegal error creation, missing typeName.");
        }
        super(route, "Failed to update: " + type.typeName);
    }
}

export class ObjectNotFoundError extends APIRequestError {
    constructor(route: string, type: any) {
        if (!type?.typeName) {
            throw new Error("Illegal error creation, missing typeName.");
        }
        super(route, "Failed to find existing: " + type.typeName);
    }
}