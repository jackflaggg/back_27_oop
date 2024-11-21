import {BaseRouter} from "../base.route";
import {LoggerService} from "../../utils/logger/logger.service";
import {Request, Response, NextFunction} from "express";

export class VercelRouter extends BaseRouter {
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            {path: '/', method: 'get', func: this.getVersionVercel}
        ])
    }
    getVersionVercel(req: Request, res: Response, next: NextFunction) {
        this.ok(res, {version: '1.0'});
    }
}