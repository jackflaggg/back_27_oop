import {BaseRoute} from "../base.route";
import {LoggerService} from "../../utils/logger/logger.service";
import {NextFunction, Request, Response} from "express";

export class VercelRouter extends BaseRoute{
    constructor(logger: LoggerService){
        super(logger);
        this.bindRoutes([
            {path: '/all-data', method: 'delete', func: this.deleteAll }
        ])
    }
    deleteAll(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }
}