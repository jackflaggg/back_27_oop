import {Request, Response, NextFunction} from "express";
import {MiddlewareIn} from "./base.middleware";
import {BaseRouter} from "../../types/base.route";
import {loggerServiceInterface} from "../../types/common";
import {jwtStrategyInterface} from "../../../module/user/models/user.models";

export class verifyTokenInCookieMiddleware implements MiddlewareIn {
    constructor(
        private readonly logger: loggerServiceInterface,
        private readonly jwt: jwtStrategyInterface,
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