import {Response} from "express";
import {HTTP_STATUSES, nameErr} from "../../models/common";
import {HTTPError} from "./http.error";
export type ErrorsMessageResponse = {
    errorsMessages: ErrorsMessageToResponseType[];
};

export type ErrorsMessageToResponseType = {
    message: string,
    field: string
}
export const errorsMessages = (errorData: ErrorsMessageToResponseType): ErrorsMessageResponse => {
    return {errorsMessages: [errorData]}
}


export class ThrowError extends Error {
    errorsMessage:  ErrorsMessageToResponseType[] | undefined;

    constructor(type: string, errorsMessage?:  ErrorsMessageToResponseType[] | undefined) {
        super(type);
        this.message = type;
        this.errorsMessage = errorsMessage;
    }
}

export const dropError = (error: ThrowError | Error | any, res: Response) => {
    if (error instanceof ThrowError) {
        const typeError = HTTP_STATUSES[error.message as keyof typeof nameErr];
        const arrayErrors = (error.errorsMessage && error.errorsMessage.length > 0) ?  errorsMessages(error.errorsMessage[0]) : error.message;

        return {status: typeError, arrayErrors}
    }

    res
        .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
        .send(errorsMessages({message: error.message, field: error.name}));
    return;
}
