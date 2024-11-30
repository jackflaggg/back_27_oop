import {Response} from "express";
import {HTTP_STATUSES, nameErr, statusCode} from "../../models/common";
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
    errorsMessages:  ErrorsMessageToResponseType[] | undefined;

    constructor(type: string, errorsMessages?:  ErrorsMessageToResponseType[] | undefined) {
        super(type);
        this.message = type;
        this.errorsMessages = errorsMessages;
    }
}

export const dropError = (error: ThrowError | Error | any, res: Response) => {

    if (error instanceof ThrowError) {
        const numberError = statusCode[error.message as keyof typeof nameErr];

        const arrayErrors = (error.errorsMessages && error.errorsMessages.length > 0) ?  errorsMessages(error.errorsMessages[0]) : error.message;

        return res.status(numberError).send(arrayErrors);
    }

    return res
            .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
            .send(errorsMessages({message: error.message, field: error.name}));

}
