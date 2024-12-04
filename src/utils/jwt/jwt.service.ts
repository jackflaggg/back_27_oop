import {LoggerService} from "../logger/logger.service";
import jwt, {JwtPayload} from "jsonwebtoken";
import {SETTINGS} from "../../settings";

export class JwtService {
    constructor(private readonly logger: LoggerService){}
    async createAccessToken(payload: string){
        try {
            return jwt.sign(
                {userId: payload},
                SETTINGS.SECRET_KEY,
                {expiresIn: SETTINGS.EXPIRES_IN_ACCESS_TOKEN}
            );
        } catch (error: unknown) {
            this.logger.error('[JwtService] ' + String(error));
            return;
        }
    }

    async createRefreshToken(userId: string, deviceId: string){
        try {
            return jwt.sign(
                {userId, deviceId},
                SETTINGS.SECRET_KEY,
                {expiresIn: SETTINGS.EXPIRES_IN_REFRESH_TOKEN}
            );
        } catch (error: unknown) {
            this.logger.error('[JwtService] ' + String(error));
            throw new Error('не удалось создать refresh токен')
        }
    }
    // получает закодированные данные, без гарантии,
    // что токен действителен или подпись корректна
    async decodeToken(token: string)  {
        try {
            return jwt.decode(token) as JwtPayload
        } catch (error: unknown) {
            this.logger.error('[JwtService] ' + String(error));
            throw new Error('не удалось декодировать пришедшие данные')
        }
    }
    // проверяет его подпись с использованием секретного ключа
    async verifyRefreshToken(refreshToken: string)  {
        try {
            const decoded = jwt.verify(refreshToken, SETTINGS.SECRET_KEY);
            return { token: decoded }
        } catch (error: unknown) {
            if (error instanceof jwt.TokenExpiredError) {
                return { expired: true };
            }
            this.logger.error('[JwtService] ' + String(error));
            return;
        }
    }

    async getUserIdByRefreshToken(token: string) {
        try {
            return jwt.verify(token, SETTINGS.SECRET_KEY) as JwtPayload;
        } catch (error: unknown){
            if (error instanceof jwt.TokenExpiredError) {
                return { expired: true }
            }
            this.logger.error('[JwtService] ' + String(error));
            throw new Error('ошибка при получении пэйлоуда')
        }
    }
}