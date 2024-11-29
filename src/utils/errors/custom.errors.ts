import {Response} from "express";
import {HTTPError} from "./http.error";
import {HTTP_STATUSES} from "../../models/common";

interface arrayErrors {
    message: string;
    field: string
}

export class ThrowError extends Error {
    arrayErrors: arrayErrors[] | undefined;

    constructor(msg: string, arrayErrors?: arrayErrors[]) {
        super(msg);
        this.message = msg;
        this.arrayErrors = arrayErrors;
    }
}

export const dropError = (error: ThrowError | Error, res: Response) => {
    if (error instanceof ThrowError) {
        res.status().send();
        return;
    }

    res
        .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
        .send({errorMessages: [{message: error.message, field: error.name}]});
    return;
}
