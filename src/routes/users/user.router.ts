import {BaseRouter} from "../base.route";
import {LoggerService} from "../../utils/logger/logger.service";
import {NextFunction, Request, Response} from "express";
import {UserModelClass} from "../../db/db";
import {randomUUID} from "node:crypto";
import {AdminMiddleware} from "../../middlewares/admin.middleware";

export class UsersRouter extends BaseRouter {
    constructor(logger: LoggerService){
        super(logger);
        this.bindRoutes([
            { path: '/register', method: 'post', func: this.createUser, middlewares: [new AdminMiddleware(new LoggerService(), this)]},
            { path: '/', method: 'delete', func: this.deleteUser, middlewares: [new AdminMiddleware(new LoggerService(), this)] },
            { path: '/', method: 'get', func: this.getAllUsers, middlewares: [new AdminMiddleware(new LoggerService(), this)] },
        ])
    }
    async createUser(req: Request, res: Response, next: NextFunction){
        const {login, password, email} = req.body;
        const createdAt = new Date().toISOString();
        const emailConfirmation = {
            confirmationCode:   randomUUID(),
            expirationDate:     new Date(),  // меняется на null
            isConfirmed:        false
        }
        const create = await UserModelClass.create({login, password, email, createdAt, emailConfirmation});
        console.log(create)
        this.created(res, create)
    }
    deleteUser(req: Request, res: Response, next: NextFunction){
        this.noContent(res)
    }
    getAllUsers(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'all users');
    }
}