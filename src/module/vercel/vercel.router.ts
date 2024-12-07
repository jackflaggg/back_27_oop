import {BaseRouter} from "../../models/base.route";
import {Request, Response, NextFunction} from "express";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";
import {vercelRouterInterface} from "../../models/vercel/vercel.models";

export class VercelRouter extends BaseRouter implements vercelRouterInterface {
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            {path: '/', method: 'get', func: this.getVersionVercel}
        ])
    }
    async getVersionVercel(req: Request, res: Response, next: NextFunction): Promise<void> {
        this.ok(res, {version: '2.0'});
        return;
    }
}