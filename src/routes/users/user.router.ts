import {BaseRoute} from "../base.route";
import {LoggerService} from "../../utils/logger/logger.service";
import {NextFunction, Request, Response} from "express";

export class UsersRouter extends BaseRoute {
    constructor(logger: LoggerService){
        super(logger);
        this.bindRoutes([
            { path: '/', method: 'post', func: this.createUser},
            { path: '/', method: 'delete', func: this.deleteUser },
            { path: '/', method: 'get', func: this.getAllUsers },
        ])
    }
    createUser(req: Request, res: Response, next: NextFunction){
        this.created(res, 'create user')
    }
    deleteUser(req: Request, res: Response, next: NextFunction){
        this.noContent(res)
    }
    getAllUsers(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'all users');
    }
}