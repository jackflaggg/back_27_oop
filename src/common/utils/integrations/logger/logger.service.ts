import {Logger} from 'tslog'
import {LoggerServiceInterface} from "../../../../models/common";
import {injectable} from "inversify";

// абстракция над логгером для того,
// 1) чтобы скрыть настройки от пользователя (другие сервисы)
// 2) доп. сайд эффект над еррор - дополнение и расширение
@injectable()
export class LoggerService implements LoggerServiceInterface {
    public logger: Logger<LoggerServiceInterface>;

    constructor() {
        this.logger = new Logger<LoggerServiceInterface>({})
    }

    log(...args: unknown[]) {
        this.logger.info(...args);
    }

    error(...args: unknown[]) {
        this.logger.error(...args);
    }

    warn(...args: unknown[]) {
        this.logger.warn(...args);
    }
}