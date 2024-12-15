import {App} from "./app";
import { Container, ContainerModule, interfaces } from "inversify"
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
import {TYPES} from "./common/types/types";
import "reflect-metadata";

export const commonContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<App>(TYPES.App).to(App).inSingletonScope()
    bind<LoggerService>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
    bind<MongooseService>(TYPES.MongooseService).to(MongooseService);
});

export const vercelContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<VercelRouter>(TYPES.VercelRouter).to(VercelRouter).inSingletonScope();
});

export const testingContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<TestingRouter>(TYPES.TestingRouter).to(TestingRouter).inSingletonScope();
    bind<TestingDbRepositories>(TYPES.TestingDbRepo).to(TestingDbRepositories).inSingletonScope();
});

export const userContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<UsersRouter>(TYPES.UsersRouter).to(UsersRouter).inSingletonScope();
    bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
    bind<UsersDbRepository>(TYPES.UserDbRepo).to(UsersDbRepository).inSingletonScope();
    bind<UsersQueryRepository>(TYPES.UserQueryRepo).to(UsersQueryRepository).inSingletonScope();
});

export const authContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<AuthRouter>(TYPES.AuthRouter).to(AuthRouter).inSingletonScope();
    bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
    bind<PasswordRecoveryDbRepository>(TYPES.PasswordRecoveryDbRepo).to(PasswordRecoveryDbRepository).inSingletonScope();
    bind<JwtStrategy>(TYPES.JwtStrategy).to(JwtStrategy).inSingletonScope();
});

export const commentContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<CommentRouter>(TYPES.CommentRouter).to(CommentRouter).inSingletonScope();
    bind<CommentsQueryRepository>(TYPES.CommentsQueryRepo).to(CommentsQueryRepository).inSingletonScope();
    bind<CommentService>(TYPES.CommentService).to(CommentService).inSingletonScope();
    bind<CommentsDbRepository>(TYPES.CommentsDbRepo).to(CommentsDbRepository).inSingletonScope();
})

export const blogContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<BlogRouter>(TYPES.BlogRouter).to(BlogRouter).inSingletonScope();
    bind<BlogService>(TYPES.BlogService).to(BlogService).inSingletonScope();
    bind<BlogsDbRepository>(TYPES.BlogsDbRepo).to(BlogsDbRepository).inSingletonScope();
    bind<BlogsQueryRepositories>(TYPES.BlogsQueryRepo).to(BlogsQueryRepositories).inSingletonScope();
})

export const postContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<PostRouter>(TYPES.PostRouter).to(PostRouter).inSingletonScope();
    bind<PostService>(TYPES.PostService).to(PostService).inSingletonScope();
    bind<PostsDbRepository>(TYPES.PostsDbRepo).to(PostsDbRepository).inSingletonScope();
    bind<PostsQueryRepository>(TYPES.PostsQueryRepo).to(PostsQueryRepository).inSingletonScope();
})

export const sessionContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind<SessionRouter>(TYPES.SessionRouter).to(SessionRouter).inSingletonScope();
    bind<SecurityService>(TYPES.SecurityService).to(SecurityService).inSingletonScope();
    bind<SecurityDevicesDbRepository>(TYPES.SecurityDevicesDbRepo).to(SecurityDevicesDbRepository).inSingletonScope();
    bind<SecurityDevicesQueryRepository>(TYPES.SecurityDevicesQueryRepo).to(SecurityDevicesQueryRepository).inSingletonScope();
})

const arrayContainer = [
    commonContainer,
    postContainer,
    commentContainer,
    blogContainer,
    userContainer,
    authContainer,
    sessionContainer,
    vercelContainer,
    testingContainer
]

function bootstrap() {
    // создаем контейнер
    const exampleAppContainer = new Container();
    // прокидываем все зависимости
    for (const container of arrayContainer) {
        exampleAppContainer.load(container);
    }
    // получаем экземпляр приложения
    const app = exampleAppContainer.get<App>(TYPES.App);
    // инициализируем приложение
    app.init();
    return app
}

export const {app} = bootstrap();