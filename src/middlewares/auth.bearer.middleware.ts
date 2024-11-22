import {LoggerService} from "../utils/logger/logger.service";
import {UsersQueryRepository} from "../repositories/users/users.query.repository";
import {JwtService} from "../utils/jwt/jwt.service";
import {Request, Response, NextFunction} from "express";
import {BaseRouter} from "../routes/base.route";
import {MiddlewareIn} from "./base.middleware";

export class AuthBearerMiddleware implements MiddlewareIn {
    constructor(private readonly logger: LoggerService,
                private readonly userQueryRepositories: UsersQueryRepository,
                private readonly jwt: JwtService,
                private router: BaseRouter) {
    }

    async execute(req: Request, res: Response, next: NextFunction) {
        const {authorization: auth} = req.headers;

        if (!auth){
            this.logger.error('[AuthBearerMiddleware] Отсутствует хэдер auth');
            this.router.noAuth(res);
            return;
        }

        const token = auth.split(' ')[1];

        const jwtPay = await this.jwt.getUserIdByRefreshToken(token);

        if (!jwtPay){
            this.logger.error('[jwt] Отсутствует id юзера');
            this.router.noAuth(res);
            return;
        }

        const existUser = await this.userQueryRepositories.getUserById(jwtPay);

        if (!existUser){
            this.logger.error('[userQueryRepositories] Отсутствует id юзера');
            this.router.noAuth(res);
            return;
        }

        req.userId = existUser;
        next();
    }
}