import { MongoMemoryServer } from 'mongodb-memory-server'
import {connectToDB} from "../../src/common/database";
import {SETTINGS} from "../../src/common/config/settings";

let mongoDb: MongoMemoryServer;

export const connect = async (): Promise<void> => {
    mongoDb = await MongoMemoryServer.create();
    const uri = mongoDb.getUri();
    console.log(uri);
    await connectToDB(Number(SETTINGS.PORT));
}

export const disconnect = async (): Promise<void> => {
    await mongoDb.stop();
}

