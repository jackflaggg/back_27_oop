import { rateLimit } from 'express-rate-limit';
import {HTTP_STATUSES} from "../models/common";
import {IMiddleware} from "../routes/route.interface";
import {Response, Request, NextFunction, Router} from "express";

export class Limiter implements IMiddleware {
    async execute(req: Request, res: Response, next: NextFunction) {
        rateLimit({
            windowMs: 10 * 1000,
            limit: 5,
            message: 'слишком много запросов, повтори попытку через 10 секунд',
            statusCode: HTTP_STATUSES.TOO_MANY_REQUESTS_429
        })
        next()
    }
}
export const registrationLimiter = rateLimit({
    windowMs: 10 * 1000,
    limit: 5,
    message: 'слишком много запросов, повтори попытку через 10 секунд',
    statusCode: HTTP_STATUSES.TOO_MANY_REQUESTS_429
});

export const loginLimiter = rateLimit({
    windowMs: 10 * 1000,
    limit: 5,
    message: 'слишком много запросов, повтори попытку через 10 секунд',
    statusCode: HTTP_STATUSES.TOO_MANY_REQUESTS_429
});

export const emailLimiter = rateLimit({
    windowMs: 10 * 1000,
    limit: 5,
    message: 'слишком много запросов, повтори попытку через 10 секунд',
    statusCode: HTTP_STATUSES.TOO_MANY_REQUESTS_429
});