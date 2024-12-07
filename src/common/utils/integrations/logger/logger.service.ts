import {Logger} from 'tslog'
import {loggerServiceInterface} from "../../../../models/common";
import {injectable} from "inversify";

// абстракция над логгером для того,
// 1) чтобы скрыть настройки от пользователя (другие сервисы)
// 2) доп. сайд эффект над еррор - дополнение и расширение
@injectable()
export class LoggerService implements loggerServiceInterface {
    public logger: Logger<loggerServiceInterface>;

    constructor() {
        this.logger = new Logger<loggerServiceInterface>({})
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