import mongoose from "mongoose";
import {LoggerService} from "../../utils/logger/logger.service";

export class TestingDbRepositories {
    logger: LoggerService;

    constructor(logger: LoggerService) {
        this.logger = logger;
    }

    async delete() {
        const collectionsToDelete = ['blogs', 'posts', 'users', 'comments', 'sessions', 'recoverypasswords', 'refreshtokens']
        try {
            for (const collectionsToDeleteElement of collectionsToDelete) {
                await mongoose.connection.collection(collectionsToDeleteElement).deleteMany({});
            }
            this.logger.warn('база данных очищена!')
        } catch(err: unknown){
            this.logger.error('произошла ошибка при очистке' + String(err));
        }
    }
}