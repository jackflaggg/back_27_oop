import { MongooseService} from "./db/db";
import {App} from "./app";
import {LoggerService} from "./utils/logger/logger.service";
import {UsersRouter} from "./routes/users/user.router";
import {TestingRouter} from "./routes/testing/testing.router";
import {AuthRouter} from "./routes/auth/auth.router";
import {BlogRouter} from "./routes/blogs/blog.router";
import {PostRouter} from "./routes/posts/post.router";
import {SessionRouter} from "./routes/sessions/session.router";
import {CommentRouter} from "./routes/comments/comment.router";
import {VercelRouter} from "./routes/vercel/vercel.router";
import {ExceptionFilter} from "./utils/errors/exception.filter";
import {TestingDbRepositories} from "./repositories/testing/testing.db.repository";


// сборка приложения
const startApp = async () => {
    const app = new App(
        new MongooseService(new LoggerService()),
        new LoggerService(),
        new ExceptionFilter(new LoggerService()),
        new TestingRouter(new LoggerService(), new TestingDbRepositories(new LoggerService())),
        new UsersRouter(new LoggerService()),
        new AuthRouter(new LoggerService()),
        new BlogRouter(new LoggerService()),
        new PostRouter(new LoggerService()),
        new SessionRouter(new LoggerService()),
        new CommentRouter(new LoggerService()),
        new VercelRouter(new LoggerService()));
    await app.init()
}

startApp()
