import "reflect-metadata";
import {BaseRouter} from "../../common/types/base.route";
import {Request, Response, NextFunction} from "express";
import {SecurityService} from "./security.service";
import {verifyTokenInCookieMiddleware} from "../../common/utils/middlewares/verify.token.in.cookie.middleware";
import {JwtStrategy} from "../auth/strategies/jwt.strategy";
import {dropError} from "../../common/utils/errors/custom.errors";
import {loggerServiceInterface} from "../../common/types/common";
import {inject, injectable} from "inversify";
import {TYPES} from "../../common/types/types";
import {securityDevicesQueryRepoInterface, sessionRouterInterface} from "./models/session.models";

@injectable()
export class SessionRouter extends BaseRouter implements sessionRouterInterface {
    constructor(
                @inject(TYPES.LoggerService) logger: loggerServiceInterface,
                @inject(TYPES.JwtStrategy) private readonly jwtStrategy: JwtStrategy,
                @inject(TYPES.SecurityDevicesQueryRepo) private readonly securityDevicesQuery: securityDevicesQueryRepoInterface,
                @inject(TYPES.SecurityService) private readonly devicesService: SecurityService) {
        super(logger);
        this.bindRoutes([
            {path: '/devices',      method: 'get',      func: this.getAllSessions,  middlewares: [new verifyTokenInCookieMiddleware(this.logger, this.jwtStrategy, this)]},
            {path: '/devices',      method: 'delete',   func: this.deleteSessions,  middlewares: [new verifyTokenInCookieMiddleware(this.logger, this.jwtStrategy, this)]},
            {path: '/devices/:id',  method: 'delete',   func: this.deleteSession,   middlewares: [new verifyTokenInCookieMiddleware(this.logger, this.jwtStrategy, this)]},
        ])
    }

    async getAllSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.cookies;
            // TODO: правильно ли обращаться к jwt или нужно было к authservice ?
            const ult = await this.jwtStrategy.verifyRefreshToken(refreshToken);

            const activeSessions = await this.securityDevicesQuery.getSessionToUserId(ult!.userId);

            this.ok(res, activeSessions);
            return;
        } catch (err: unknown) {
            dropError(err, res)
            return;
        }
    }

    async deleteSessions(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { refreshToken } = req.cookies;

            await this.devicesService.deleteAllSessions(refreshToken);
            this.noContent(res);
            return;
        } catch (err: unknown) {
            dropError(err, res)
            return;
        }
    }

    async deleteSession(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const { refreshToken } = req.cookies;

            const {id} = req.params;

            await this.devicesService.deleteOneSession(id, refreshToken)

            this.noContent(res)
            return;
        } catch (err: unknown) {
            dropError(err, res)
            return;
        }
    }
}