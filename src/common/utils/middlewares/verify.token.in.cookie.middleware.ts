import {Request, Response, NextFunction} from "express";
import {MiddlewareIn} from "./base.middleware";
import {BaseRouter} from "../../../models/base.route";
import {JwtStrategy} from "../../../module/auth/strategies/jwt.strategy";
import {LoggerService} from "../integrations/logger/logger.service";

export class verifyTokenInCookieMiddleware implements MiddlewareIn {
    constructor(private readonly logger: LoggerService,
                private readonly jwt: JwtStrategy,
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