import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {Request, Response, NextFunction} from "express";

export class SessionRouter extends BaseRouter{
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            {path: '/devices', method: 'get', func: this.getAllSessions},
            {path: '/devices', method: 'delete', func: this.deleteSessions},
            {path: '/devices/:id', method: 'delete', func: this.deleteSession},
        ])
    }

    getAllSessions(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'all sessions');
    }

    deleteSessions(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }

    deleteSession(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }
}