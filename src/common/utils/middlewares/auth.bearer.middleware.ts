import {Request, Response, NextFunction} from "express";
import {BaseRouter} from "../../../models/base.route";
import {MiddlewareIn} from "./base.middleware";
import {UsersQueryRepository} from "../../../module/user/users.query.repository";
import {JwtStrategy} from "../../../module/auth/strategies/jwt.strategy";
import {LoggerService} from "../integrations/logger/logger.service";

export class AuthBearerMiddleware implements MiddlewareIn {
    constructor(private readonly logger: LoggerService,
                private readonly userQueryRepositories: UsersQueryRepository,
                private readonly jwt: JwtStrategy,
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