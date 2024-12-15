import express, {Express} from 'express'
import cors from 'cors'
import {SETTINGS} from "./common/config/settings";
import cookieParser from "cookie-parser";
import {Server} from "node:http";
import {UsersRouter} from "./module/user/user.router";
import {TestingRouter} from "./module/testing/testing.router";
import {AuthRouter} from "./module/auth/auth.router";
import {BlogRouter} from "./module/blog/blog.router";
import {PostRouter} from "./module/post/post.router";
import {SessionRouter} from "./module/security/session.router";
import {CommentRouter} from "./module/comment/comment.router";
import {VercelRouter} from "./module/vercel/vercel.router";
import {MongooseService} from "./common/database/mongoose.service";
import {LoggerService} from "./common/utils/integrations/logger/logger.service";
import {inject, injectable} from "inversify";
import {TYPES} from "./common/types/types";

@injectable()
export class App {
    app: Express;
    server: Server | undefined;
    port: number;

    constructor(
        @inject(TYPES.MongooseService)  private db: MongooseService,
        @inject(TYPES.LoggerService)    private logger: LoggerService,
        @inject(TYPES.TestingRouter)    private testingRouter: TestingRouter,
        @inject(TYPES.UsersRouter)      private userRouter: UsersRouter,
        @inject(TYPES.AuthRouter)       private authRouter: AuthRouter,
        @inject(TYPES.BlogRouter)       private blogRouter: BlogRouter,
        @inject(TYPES.PostRouter)       private postRouter: PostRouter,
        @inject(TYPES.SessionRouter)    private sessionRouter: SessionRouter,
        @inject(TYPES.CommentRouter)    private commentRouter: CommentRouter,
        @inject(TYPES.VercelRouter)     private vercelRouter: VercelRouter) {
        this.app = express();
        this.port = Number(SETTINGS.PORT);
    }

    public useRoutes(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(cookieParser());

        this.app.use('/testing',    this.testingRouter.router);
        this.app.use('/users',      this.userRouter.router);
        this.app.use('/auth',       this.authRouter.router);
        this.app.use('/blogs',      this.blogRouter.router);
        this.app.use('/posts',      this.postRouter.router);
        this.app.use('/security',   this.sessionRouter.router);
        this.app.use('/comments',   this.commentRouter.router);
        this.app.use('/',           this.vercelRouter.router);
    }

    public async init(): Promise<void> {
        this.useRoutes();
        await this.db.connect();
        this.server = this.app.listen(this.port);
        this.logger.log('сервер запущен на http://localhost:' + this.port);
    }
}


