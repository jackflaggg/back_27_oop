import mongoose from "mongoose";
import {SETTINGS} from "../config/settings";
import {mongoURI} from "./database.module";
import {LoggerService} from "../utils/integrations/logger/logger.service";

export class MongooseService {

    constructor(private logger: LoggerService) {}

    public async connect() {
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

    public async disconnect() {
        try {
            await mongoose.disconnect();
            this.logger.log('Успешное отключение!');
        } catch(error: unknown) {
            if (error instanceof Error) {
                this.logger.error('рухнул дисконнект! ' + String(error));
            }
            this.logger.error('Boom!  ' + String(error));
        }

    }
}