import express, {Express} from 'express'
import cors from 'cors'
import {SETTINGS} from "./settings";
import cookieParser from "cookie-parser";
import {Server} from "node:http";
import {LoggerService} from "./utils/logger/logger.service";
import {UsersRouter} from "./routes/users/user.router";
import {TestingRouter} from "./routes/testing/testing.router";

export class App {
    app: Express;
    server: Server | undefined;
    port: number;
    logger: LoggerService;
    userRouter: UsersRouter;
    vercelRouter: TestingRouter;

    constructor(logger: LoggerService, userRouter: UsersRouter, vercelRouter: TestingRouter) {
        this.app = express();
        this.port = Number(SETTINGS.PORT);
        this.logger = logger;
        this.userRouter = userRouter;
        this.vercelRouter = vercelRouter;
    }

    public useRoutes(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(cookieParser());

        this.app.use('/testing', this.vercelRouter.router);
        this.app.use('/users', this.userRouter.router);
    }

    public async init() {
        this.useRoutes();
        this.server = this.app.listen(this.port);
    }
}


