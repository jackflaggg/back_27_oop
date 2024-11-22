import {Request, Response, NextFunction} from "express";
import {MiddlewareIn} from "./base.middleware";
import {LoggerService} from "../utils/logger/logger.service";
import {JwtService} from "../utils/jwt/jwt.service";
import {BaseRouter} from "../routes/base.route";

export class verifyTokenInCookieMiddleware implements MiddlewareIn {
    constructor(private readonly logger: LoggerService,
                private readonly jwt: JwtService,
                private readonly router: BaseRouter) {}
    async execute(req: Request, res: Response, next: NextFunction) {
        const {refreshToken} = req.cookies;

        if(!refreshToken){
            this.logger.error('[verifyTokenInCookieMiddleware] токен отсутствует в куке')
            this.router.noAuth(res);
            return;
        }

        try {
            const verifyToken = await this.jwt.verifyRefreshToken(refreshToken);
            this.logger.log(`проверяем че пришло в верифай-REFRESH токен: ${JSON.stringify(verifyToken)}`);

            if (!verifyToken || verifyToken.expired){
                this.logger.error(`[verifyToken] походу истек`);
                this.router.noAuth(res);
                return;
            }

            next();

        } catch (error: unknown) {
            this.logger.error('[verifyTokenInCookieMiddleware] глобальная ошибка! ' + String(error));
            this.router.serverError(res);
            return;
        }
    }
}