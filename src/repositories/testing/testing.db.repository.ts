import mongoose from "mongoose";
import {LoggerService} from "../../utils/logger/logger.service";

export class testingDbRepositories {
    logger: LoggerService;
    constructor(logger: LoggerService) {
        this.logger = logger;
    }

    async delete() {
        try {
            await mongoose.connection.dropDatabase();
            this.logger.log('база данных очищена!')
        } catch(err: unknown){
            this.logger.error('произошла ошибка при очистке' + String(err));
        }
    }
}