import {ISettingsParam, Logger} from 'tslog'
import {LoggerServiceIn} from "../../models/common";

// абстракция над логгером для того,
// 1) чтобы скрыть настройки от пользователя (другие сервисы)
// 2) доп. сайд эффект над еррор - дополнение и расширение
export class LoggerService implements LoggerServiceIn {
    public logger: Logger<LoggerServiceIn>;

    constructor() {
        this.logger = new Logger<LoggerServiceIn>({})
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