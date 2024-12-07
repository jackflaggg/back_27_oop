import {BaseRouter} from "../../models/base.route";
import {Request, Response, NextFunction} from "express";
import {SecurityService} from "./security.service";
import {verifyTokenInCookieMiddleware} from "../../common/utils/middlewares/verify.token.in.cookie.middleware";
import {SecurityDevicesQueryRepository} from "./security.devices.query.repository";
import {JwtStrategy} from "../auth/strategies/jwt.strategy";
import {dropError} from "../../common/utils/errors/custom.errors";
import {loggerServiceInterface} from "../../models/common";
import {inject, injectable} from "inversify";
import {TYPES} from "../../models/types/types";
import {securityDevicesQueryRepoInterface, sessionRouterInterface} from "../../models/session/session.models";

@injectable()
export class SessionRouter extends BaseRouter implements sessionRouterInterface {
    constructor(
                @inject(TYPES.LoggerService) logger: loggerServiceInterface,
                private readonly jwtStrategy: JwtStrategy,
                private readonly securityDevicesQuery: securityDevicesQueryRepoInterface,
                private readonly devicesService: SecurityService) {
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