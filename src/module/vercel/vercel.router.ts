import "reflect-metadata";
import {BaseRouter} from "../../common/types/base.route";
import {Request, Response, NextFunction} from "express";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";
import {vercelRouterInterface} from "./models/vercel.models";
import {inject, injectable} from "inversify";
import {TYPES} from "../../common/types/types";


@injectable()
export class VercelRouter extends BaseRouter implements vercelRouterInterface {
    constructor(@inject(TYPES.LoggerService) logger: LoggerService) {
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