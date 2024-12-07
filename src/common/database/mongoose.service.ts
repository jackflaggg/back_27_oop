import mongoose from "mongoose";
import {SETTINGS} from "../config/settings";
import {mongoURI} from "./database.module";
import {LoggerService} from "../utils/integrations/logger/logger.service";
import {mongooseServiceInterface} from "../../models/common";

export class MongooseService implements mongooseServiceInterface {

    constructor(private logger: LoggerService) {}

    public async connect(): Promise<void> {
        try {
            await mongoose.connect(mongoURI, {
                dbName: SETTINGS.DB_NAME,
                sanitizeFilter: false
            });
            this.logger.log('Успешное подключение к базе данных!');
        } catch(error: unknown) {
            this.logger.error('База рухнула! ' + String(error));
            await this.disconnect();
            process.exit(1);
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            this.logger.log('Успешное отключение!');
            return;
        } catch(error: unknown) {
            if (error instanceof Error) {
                this.logger.error('рухнул дисконнект! ' + String(error));
            }
            this.logger.error('Boom!  ' + String(error));
            return;
        }

    }
}