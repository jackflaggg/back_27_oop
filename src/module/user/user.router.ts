import {BaseRouter} from "../../models/base.route";
import {AdminMiddleware} from "../../common/utils/middlewares/admin.middleware";
import {ValidateMiddleware} from "../../common/utils/middlewares/validate.middleware";
import {UserCreateDto} from "./dto/user.create.dto";
import {Request, Response, NextFunction} from "express";
import {validateId} from "../../common/utils/validators/params.validator";
import {RequestWithQuery} from "../../models/request.response.params";
import {
    InQueryUserModel,
    userQueryRepoInterface,
    userRouterInterface,
    userServiceInterface
} from "../../models/user/user.models";
import {dropError} from "../../common/utils/errors/custom.errors";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";
import {queryHelperToUser} from "../../common/utils/features/query.helper";
import {inject, injectable} from "inversify";
import {loggerServiceInterface} from "../../models/common";
import {TYPES} from "../../models/types/types";

@injectable()
export class UsersRouter extends BaseRouter implements userRouterInterface {
    constructor(
        @inject(TYPES.LoggerService)    logger: loggerServiceInterface,
        @inject(TYPES.UserService)      private userService: userServiceInterface,
        @inject(TYPES.UserQueryRepo)    private userQueryRepo: userQueryRepoInterface){
        super(logger);
        this.bindRoutes([
            { path: '/',    method: 'post',     func: this.createUser,  middlewares: [new AdminMiddleware(new LoggerService(), this), new ValidateMiddleware(UserCreateDto)]},
            { path: '/:id', method: 'delete',   func: this.deleteUser,  middlewares: [new AdminMiddleware(new LoggerService(), this)] },
            { path: '/',    method: 'get',      func: this.getAllUsers, middlewares: [new AdminMiddleware(new LoggerService(), this)] },
        ])
    }
    async createUser(req: Request, res: Response, next: NextFunction){
        try {
            const {login, password, email} = req.body;

            const user = await this.userService.createUser(new UserCreateDto(login, password, email));

            this.created(res, user)
            return;
        } catch(err: unknown){
            dropError(err, res);
            return;
        }
    }
    async deleteUser(req: Request, res: Response, next: NextFunction){
        try {
            const {id} = req.params;

            validateId(id)

            await this.userService.deleteUser(id);
            this.noContent(res);
            return;
        } catch (err: unknown) {
            dropError(err, res);
            return;
        }
    }
    async getAllUsers(req: RequestWithQuery<InQueryUserModel>, res: Response, next: NextFunction){
        try {
            const queryUser = queryHelperToUser(req.query);

            const getUsers = await this.userQueryRepo.getAllUsers(queryUser);
            this.ok(res, getUsers);
            return;
        } catch(err: unknown){
            dropError(err, res);
            return;
        }
    }
}