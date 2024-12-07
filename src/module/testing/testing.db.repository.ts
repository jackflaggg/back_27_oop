import mongoose from "mongoose";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";
import {SETTINGS} from "../../common/config/settings";

export class TestingDbRepositories {
    logger: LoggerService;

    constructor(logger: LoggerService) {
        this.logger = logger;
    }

    async delete() {
        const collectionsToDelete: string[] = [
            SETTINGS.COLLECTION_BLOGS,
            SETTINGS.COLLECTION_USERS,
            SETTINGS.COLLECTION_POSTS,
            SETTINGS.COLLECTION_COMMENTS,
            SETTINGS.COLLECTION_DEVICES,
            SETTINGS.COLLECTION_SESSIONS];
        try {
            for (const collectionsToDeleteElement of collectionsToDelete) {
                await mongoose.connection.collection(collectionsToDeleteElement).deleteMany({});
            }
            this.logger.warn('база данных очищена!');
            return;
        } catch(err: unknown){
            this.logger.error('произошла ошибка при очистке' + String(err));
            return;
        }
    }
}