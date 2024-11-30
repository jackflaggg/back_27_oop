import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {Request, Response, NextFunction} from "express";
import {dropError} from "../../utils/errors/custom.errors";
import {JwtService} from "../../utils/jwt/jwt.service";
import {SecurityDevicesQueryRepository} from "../../repositories/security-devices/security.devices.query.repository";

export class SessionRouter extends BaseRouter{
    constructor(logger: LoggerService, private readonly jwtService: JwtService, private readonly securityDevicesQuery: SecurityDevicesQueryRepository) {
        super(logger);
        this.bindRoutes([
            {path: '/devices', method: 'get', func: this.getAllSessions},
            {path: '/devices', method: 'delete', func: this.deleteSessions},
            {path: '/devices/:id', method: 'delete', func: this.deleteSession},
        ])
    }

    async getAllSessions(req: Request, res: Response, next: NextFunction){
        try {
            const { refreshToken } = req.cookies;

            const ult = await this.jwtService.getUserIdByRefreshToken(refreshToken);

            const activeSessions = await this.securityDevicesQuery.getSessionToUserId(ult.userId);
            this.ok(res, activeSessions);
        } catch (err: unknown) {
            dropError(err, res)
            return;
        }
    }

    async deleteSessions(req: Request, res: Response, next: NextFunction){
        try {
            this.ok(res, 'all sessions');
        } catch (err: unknown) {
            dropError(err, res)
            return;
        }
    }

    async deleteSession(req: Request, res: Response, next: NextFunction){
        try {
            this.ok(res, 'all sessions');
        } catch (err: unknown) {
            dropError(err, res)
            return;
        }
    }
}