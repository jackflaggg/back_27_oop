import {SETTINGS} from "./settings";
import {connectToDB} from "./db/db";
import {App} from "./app";
import {LoggerService} from "./utils/logger/logger.service";
import {UsersRouter} from "./routes/users/user.router";
import {TestingRouter} from "./routes/testing/testing.router";


// сборка приложения
const startApp = async () => {
    const app = new App(new LoggerService(), new UsersRouter(new LoggerService()), new TestingRouter(new LoggerService()));
    await connectToDB(Number(SETTINGS.PORT));
    await app.init()
}

startApp()
