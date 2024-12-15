import {Request, Response, NextFunction} from "express";
import {BaseRouter} from "../../types/base.route";
import {MiddlewareIn} from "./base.middleware";
import {loggerServiceInterface} from "../../types/common";
import {jwtStrategyInterface, userQueryRepoInterface} from "../../../module/user/models/user.models";

export class AuthBearerMiddleware implements MiddlewareIn {
    constructor(private readonly logger: loggerServiceInterface,
                private readonly userQueryRepositories: userQueryRepoInterface,
                private readonly jwt: jwtStrategyInterface,
                private router: BaseRouter) {}

    async execute(req: Request, res: Response, next: NextFunction) {
        const {authorization: auth} = req.headers;

        if (!auth){
            this.logger.error('[AuthBearerMiddleware] Отсутствует хэдер auth');
            this.router.noAuth(res);
            return;
        }

        const token = auth.split(' ')[1];

        const jwtPay = await this.jwt.verifyRefreshToken(token);

        if (!jwtPay || jwtPay.expired){
            this.router.noAuth(res);
            return;
        }

        const existUser = await this.userQueryRepositories.getUserById(jwtPay.userId);

        if (!existUser){
            this.logger.error('[userQueryRepositories] Отсутствует id юзера');
            this.router.noAuth(res);
            return;
        }

        req.userId = existUser;
        next();
    }
}