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
import {BlogsQueryRepositories} from "./repositories/blogs/blogs.query.repository";
import {BlogService} from "./domain/blog/blog.service";
import {BlogsDbRepository} from "./repositories/blogs/blogs.db.repository";
import {PostsQueryRepository} from "./repositories/posts/posts.query.repository";
import {UserService} from "./domain/user/user.service";
import {UsersDbRepository} from "./repositories/users/users.db.repository";
import {UsersQueryRepository} from "./repositories/users/users.query.repository";
import {PostService} from "./domain/post/post.service";
import {PostsDbRepository} from "./repositories/posts/posts.db.repository";
import {AuthService} from "./domain/auth/auth.service";
import {PasswordRecoveryDbRepository} from "./repositories/password-recovery/password-rec.db.repository";
import {JwtService} from "./utils/jwt/jwt.service";
import {SecurityDevicesQueryRepository} from "./repositories/security-devices/security.devices.query.repository";

// сборка приложения
const startApp = async () => {
    const app = new App(
        new MongooseService(new LoggerService()),
        new LoggerService(),
        new ExceptionFilter(new LoggerService()),
        new TestingRouter(new LoggerService(), new TestingDbRepositories(new LoggerService())),
        new UsersRouter(new LoggerService(), new UserService(new UsersDbRepository()), new UsersQueryRepository()),
        new AuthRouter(new LoggerService(), new AuthService(new LoggerService(), new UsersDbRepository(), new PasswordRecoveryDbRepository())),
        new BlogRouter(new LoggerService(), new BlogsQueryRepositories(), new BlogService(new BlogsDbRepository())),
        new PostRouter(new LoggerService(), new PostsQueryRepository(), new PostService(new PostsDbRepository())),
        new SessionRouter(new LoggerService(), new JwtService(new LoggerService()), new SecurityDevicesQueryRepository()),
        new CommentRouter(new LoggerService()),
        new VercelRouter(new LoggerService()));
    await app.init()
}

startApp()
