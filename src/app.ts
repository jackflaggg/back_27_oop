import express, {Express} from 'express'
import cors from 'cors'
import {SETTINGS} from "./settings";
import cookieParser from "cookie-parser";
import {Server} from "node:http";
import {LoggerService} from "./utils/logger/logger.service";

export class App {
    app: Express;
    server: Server | undefined;
    port: number;
    logger: LoggerService;

    constructor(logger: LoggerService) {
        this.app = express();
        this.port = Number(SETTINGS.PORT);
        this.logger = logger;
    }

    public useRoutes(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(cookieParser());
    }

    public async init() {
        this.useRoutes();
        this.server = this.app.listen(this.port);
    }
}


