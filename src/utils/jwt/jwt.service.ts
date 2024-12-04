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
            const decoded = jwt.decode(token);

            if (!decoded) {
                this.logger.error('[JwtService] Токен не может быть декодирован: токен null');
                return null;
            }

            if (typeof decoded === 'string') {
                this.logger.warn('[JwtService] Токен был декодирован, но без полезной нагрузки');
                return null;
            }

            // Successfully decoded JWT payload
            return decoded as JwtPayload;
        } catch (error: unknown) {
            this.logger.error('[JwtService] ' + String(error));
            throw new Error('не удалось декодировать пришедшие данные');
        }
    }
    // проверяет его подпись с использованием секретного ключа
    async verifyRefreshToken(refreshToken: string)  {
        try {
            return jwt.verify(refreshToken, SETTINGS.SECRET_KEY) as JwtPayload
            //return { token: decoded }
        } catch (error: unknown) {
            if (error instanceof jwt.TokenExpiredError) {
                this.logger.error('[JwtService] токен протух');
                return { expired: true };
            } else if (error instanceof jwt.JsonWebTokenError){
                this.logger.error('[JwtService] невалидный токен: ' + String(error));
                return null;
            }
            this.logger.error('[JwtService] ошибка при валидации: ' + String(error));
            return null;
        }
    }

}