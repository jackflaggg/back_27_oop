import bcrypt from "bcrypt";
import {LoggerService} from "../logger/logger.service";

export class HashService {
    constructor(private readonly logger: LoggerService) {}
    async _generateHash(password: string, saltRounds: number = 10){
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            return await bcrypt.hash(password, salt);
        } catch (error: unknown) {
            this.logger.error('[HashService] произошла ошибка: ' + String(error));
            throw new Error('не удалось создать хэш')
        }
    }

    async comparePassword(password: string, hash: string) {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error: unknown){
            this.logger.error('[HashService] произошла ошибка: ' + String(error));
            throw new Error('не удалось сравнить хэши')
        }
    }
}