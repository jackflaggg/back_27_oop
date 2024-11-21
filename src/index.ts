import {SETTINGS} from "./settings";
import {connectToDB} from "./db/db";
import {App} from "./app";
import {LoggerService} from "./utils/logger/logger.service";


// сборка приложения
const startApp = async () => {
    const app = new App(new LoggerService());
    await connectToDB(Number(SETTINGS.PORT));
    await app.init()
}

startApp()
