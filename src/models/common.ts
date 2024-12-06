import {Logger} from "tslog";
import {LoggerService} from "../common/utils/integrations/logger/logger.service";

export interface LoggerServiceInterface {
    logger: Logger<LoggerService>;
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
}

export const nameErr = {
    'NOT_FOUND': 'NOT_FOUND',
    'BAD_REQUEST': 'BAD_REQUEST',
    'NOT_AUTHORIZATION': 'NOT_AUTHORIZATION',
    'NOT_FORBIDDEN': 'NOT_FORBIDDEN',
};

export enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    NOT_AUTHORIZATION_401 = 401,
    NOT_FORBIDDEN_403 = 403,
    NOT_FOUND_404 = 404,
    TOO_MANY_REQUESTS_429 = 429,
    INTERNAL_SERVER_ERROR_500 = 500,
}

export const statusCode = {
    'NOT_FOUND': 404,
    'BAD_REQUEST': 400,
    'NOT_AUTHORIZATION': 401,
    'NOT_FORBIDDEN': 403,
}