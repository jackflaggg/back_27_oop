import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {Request, Response, NextFunction} from "express";
import {dropError} from "../../utils/errors/custom.errors";
import {JwtService} from "../../utils/jwt/jwt.service";
import {SecurityDevicesQueryRepository} from "../../repositories/security-devices/security.devices.query.repository";
import {SecurityService} from "../../domain/security/security.service";
import {verifyTokenInCookieMiddleware} from "../../middlewares/verify.token.in.cookie.middleware";

export class SessionRouter extends BaseRouter{
    constructor(logger: LoggerService,
                private readonly jwtService: JwtService,
                private readonly securityDevicesQuery: SecurityDevicesQueryRepository,
                private readonly devicesService: SecurityService) {
        super(logger);
        this.bindRoutes([
            {path: '/devices',      method: 'get',      func: this.getAllSessions,  middlewares: [new verifyTokenInCookieMiddleware(this.logger, this.jwtService, this)]},
            {path: '/devices',      method: 'delete',   func: this.deleteSessions,  middlewares: [new verifyTokenInCookieMiddleware(this.logger, this.jwtService, this)]},
            {path: '/devices/:id',  method: 'delete',   func: this.deleteSession,   middlewares: [new verifyTokenInCookieMiddleware(this.logger, this.jwtService, this)]},
        ])
    }

    async getAllSessions(req: Request, res: Response, next: NextFunction){
        try {
            const { refreshToken } = req.cookies;

            const ult = await this.jwtService.verifyRefreshToken(refreshToken);

            const activeSessions = await this.securityDevicesQuery.getSessionToUserId(ult!.userId);

            this.ok(res, activeSessions);
            return;
        } catch (err: unknown) {
            dropError(err, res)
            return;
        }
    }

    async deleteSessions(req: Request, res: Response, next: NextFunction){
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

    async deleteSession(req: Request, res: Response, next: NextFunction){
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