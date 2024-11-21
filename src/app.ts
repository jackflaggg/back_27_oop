import express, {Express} from 'express'
import cors from 'cors'
import {SETTINGS} from "./settings";
import cookieParser from "cookie-parser";
import {Server} from "node:http";
import {LoggerService} from "./utils/logger/logger.service";
import {UsersRouter} from "./routes/users/user.router";
import {TestingRouter} from "./routes/testing/testing.router";
import {AuthRouter} from "./routes/auth/auth.router";
import {BlogRouter} from "./routes/blogs/blog.router";
import {PostRouter} from "./routes/posts/post.router";
import {SessionRouter} from "./routes/sessions/session.router";
import {CommentRouter} from "./routes/comments/comment.router";
import {VercelRouter} from "./routes/vercel/vercel.router";

export class App {
    app: Express;
    server: Server | undefined;
    port: number;
    logger: LoggerService;

    testingRouter: TestingRouter;
    userRouter: UsersRouter;
    authRouter: AuthRouter;
    blogRouter: BlogRouter;
    postRouter: PostRouter;
    sessionRouter: SessionRouter;
    commentRouter: CommentRouter;
    vercelRouter: VercelRouter;

    constructor(
        logger: LoggerService, testingRouter: TestingRouter, userRouter: UsersRouter,
        authRouter: AuthRouter, blogRouter: BlogRouter, postRouter: PostRouter,
        sessionRouter: SessionRouter, commentRouter: CommentRouter, vercelRouter: VercelRouter) {
        this.app = express();
        this.port = Number(SETTINGS.PORT);
        this.logger = logger;

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

        this.app.use('/testing', this.testingRouter.router);
        this.app.use('/users', this.userRouter.router);
        this.app.use('/auth', this.authRouter.router);
        this.app.use('/blogs', this.blogRouter.router);
        this.app.use('/posts', this.postRouter.router);
        this.app.use('/security', this.sessionRouter.router);
        this.app.use('/comments', this.commentRouter.router);
        this.app.use('/', this.vercelRouter.router);
    }

    public ExceptionFilters(){}

    public async init() {
        this.useRoutes();
        this.ExceptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.log('сервер запущен на http://localhost:' + this.port);
    }
}


