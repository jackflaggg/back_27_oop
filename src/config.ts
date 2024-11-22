import dotenv from "dotenv";
import {SETTINGS} from "./settings";
dotenv.config();

export const superConfig = {
    databaseUrl: process.env.ENV === 'test' ? SETTINGS.DB_URI_TEST : SETTINGS.MONGO_URL,
}