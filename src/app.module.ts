import {Main} from "./main";
import {MongooseService} from "./common/database/mongoose.service";
import {TestingRouter} from "./module/testing/testing.router";
import {TestingDbRepositories} from "./module/testing/testing.db.repository";
import {UsersRouter} from "./module/user/user.router";
import {UserService} from "./module/user/user.service";
import {UsersDbRepository} from "./module/user/users.db.repository";
import {UsersQueryRepository} from "./module/user/users.query.repository";
import {AuthRouter} from "./module/auth/auth.router";
import {AuthService} from "./module/auth/auth.service";
import {PasswordRecoveryDbRepository} from "./module/auth/password-rec.db.repository";
import {SecurityService} from "./module/security/security.service";
import {SecurityDevicesDbRepository} from "./module/security/security.devices.db.repository";
import {BlogRouter} from "./module/blog/blog.router";
import {BlogsQueryRepositories} from "./module/blog/blogs.query.repository";
import {BlogService} from "./module/blog/blog.service";
import {BlogsDbRepository} from "./module/blog/blogs.db.repository";
import {PostRouter} from "./module/post/post.router";
import {PostsQueryRepository} from "./module/post/posts.query.repository";
import {PostService} from "./module/post/post.service";
import {PostsDbRepository} from "./module/post/posts.db.repository";
import {CommentsDbRepository} from "./module/comment/comments.db.repository";
import {CommentsQueryRepository} from "./module/comment/comments.query.repository";
import {SessionRouter} from "./module/security/session.router";
import {SecurityDevicesQueryRepository} from "./module/security/security.devices.query.repository";
import {CommentRouter} from "./module/comment/comment.router";
import {CommentService} from "./module/comment/comment.service";
import {VercelRouter} from "./module/vercel/vercel.router";
import {JwtStrategy} from "./module/auth/strategies/jwt.strategy";
import {LoggerService} from "./common/utils/integrations/logger/logger.service";

const startApp = async () => {
    const app = new Main(
        new MongooseService(new LoggerService()),
        new LoggerService(),
        new TestingRouter(new LoggerService(), new TestingDbRepositories(new LoggerService())),
        new UsersRouter(new LoggerService(), new UserService(new UsersDbRepository()), new UsersQueryRepository()),
        new AuthRouter(new LoggerService(), new AuthService(new LoggerService(), new UsersDbRepository(), new PasswordRecoveryDbRepository(), new JwtStrategy(new LoggerService()), new SecurityService(new JwtStrategy(new LoggerService()), new SecurityDevicesDbRepository()))),
        new BlogRouter(new LoggerService(), new BlogsQueryRepositories(), new BlogService(new BlogsDbRepository())),
        new PostRouter(new LoggerService(), new PostsQueryRepository(), new PostService(new PostsDbRepository(), new CommentsDbRepository()), new CommentsQueryRepository()),
        new SessionRouter(new LoggerService(), new JwtStrategy(new LoggerService()), new SecurityDevicesQueryRepository(), new SecurityService(new JwtStrategy(new LoggerService()), new SecurityDevicesDbRepository())),
        new CommentRouter(new LoggerService(), new CommentsQueryRepository(), new CommentService(new CommentsDbRepository())),
        new VercelRouter(new LoggerService()));
    await app.init()
}

startApp()
