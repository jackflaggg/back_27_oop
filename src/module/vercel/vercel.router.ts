import {BaseRouter} from "../../models/base.route";
import {Request, Response, NextFunction} from "express";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";

export class VercelRouter extends BaseRouter {
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            {path: '/', method: 'get', func: this.getVersionVercel}
        ])
    }
    getVersionVercel(req: Request, res: Response, next: NextFunction) {
        this.ok(res, {version: '2.0'});
    }
}