import {SETTINGS} from "./settings";
import {connectToDB} from "./db/db";
import {App} from "./app";


// сборка приложения
const startApp = async () => {
    const app = new App();
    await connectToDB(Number(SETTINGS.PORT));
    await app.init()
}

startApp()
