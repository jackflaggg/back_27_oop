import {BaseRouter} from "../base.route";
import {LoggerService} from "../../utils/logger/logger.service";
import {NextFunction, Request, Response} from "express";
import {AdminMiddleware} from "../../middlewares/admin.middleware";
import {ValidateMiddleware} from "../../middlewares/validate.middleware";
import {UserCreateDto} from "../../dto/user/user.create.dto";
import {UserService} from "../../domain/user/user.service";
import {queryHelperToUser} from "../../utils/features/query/query.helper";
import {UsersQueryRepository} from "../../repositories/users/users.query.repository";
import {RequestWithQuery} from "../../models/request.response.params";
import {InQueryUserModel} from "../../models/user/user.models";

export class UsersRouter extends BaseRouter {
    constructor(logger: LoggerService, private userService: UserService, private userQueryRepo: UsersQueryRepository) {
        super(logger);
        this.bindRoutes([
            { path: '/', method: 'post', func: this.createUser, middlewares: [new AdminMiddleware(new LoggerService(), this), new ValidateMiddleware(UserCreateDto)]},
            { path: '/:id', method: 'delete', func: this.deleteUser, middlewares: [new AdminMiddleware(new LoggerService(), this)] },
            { path: '/', method: 'get', func: this.getAllUsers, middlewares: [new AdminMiddleware(new LoggerService(), this)] },
        ])
    }
    async createUser(req: Request, res: Response, next: NextFunction){
        const {login, password, email} = req.body;
        const user = await this.userService.createUser(new UserCreateDto(login, password, email));
        this.created(res, user)
        return;
    }
    deleteUser(req: Request, res: Response, next: NextFunction){
        this.noContent(res)
    }
    async getAllUsers(req: RequestWithQuery<InQueryUserModel>, res: Response, next: NextFunction){
        const queryUser = queryHelperToUser(req.query);

        const getUsers = await this.userQueryRepo.getAllUsers(queryUser);
        this.ok(res, getUsers);
        return;
    }
}