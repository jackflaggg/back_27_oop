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
import {ExceptionFilter} from "./common/utils/errors/exception.filter";
import {LoggerService} from "./common/utils/integrations/logger/logger.service";

export class Main {
    app: Express;
    server: Server | undefined;
    port: number;
    dbService: MongooseService;
    logger: LoggerService;
    exceptionFilter: ExceptionFilter;

    testingRouter: TestingRouter;
    userRouter: UsersRouter;
    authRouter: AuthRouter;
    blogRouter: BlogRouter;
    postRouter: PostRouter;
    sessionRouter: SessionRouter;
    commentRouter: CommentRouter;
    vercelRouter: VercelRouter;

    constructor(
        db: MongooseService,
        logger: LoggerService, exceptionFilter: ExceptionFilter, testingRouter: TestingRouter, userRouter: UsersRouter,
        authRouter: AuthRouter, blogRouter: BlogRouter, postRouter: PostRouter,
        sessionRouter: SessionRouter, commentRouter: CommentRouter, vercelRouter: VercelRouter) {
        this.app = express();
        this.port = Number(SETTINGS.PORT);
        this.dbService = db;
        this.logger = logger;
        this.exceptionFilter = exceptionFilter;

        this.testingRouter = testingRouter;

        this.userRouter = userRouter;
        this.authRouter = authRouter;
        this.blogRouter = blogRouter;
        this.postRouter = postRouter;
        this.sessionRouter = sessionRouter;
        this.commentRouter = commentRouter;
        this.vercelRouter = vercelRouter;
    }

    public useRoutes(){
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

    public ExceptionFilters(){
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init() {
        this.useRoutes();
        this.ExceptionFilters();
        await this.dbService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log('сервер запущен на http://localhost:' + this.port);
    }
}


