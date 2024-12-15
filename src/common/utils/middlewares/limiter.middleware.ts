import { rateLimit } from 'express-rate-limit';
import {HTTP_STATUSES} from "../../types/common";
import {IMiddleware} from "../../types/route.interface";
import {Response, Request, NextFunction} from "express";

export class Limiter implements IMiddleware {
    private _limiter;

    constructor() {
        this._limiter = rateLimit({
            windowMs: 10 * 1000,
            limit: 5,
            message: 'слишком много запросов, повтори попытку через 10 секунд',
            statusCode: HTTP_STATUSES.TOO_MANY_REQUESTS_429
        })
    }

    async execute(req: Request, res: Response, next: NextFunction) {
        this._limiter(req, res, next);
    }
}
