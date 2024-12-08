export const TYPES = {
    MongooseService:          Symbol.for("MongooseService"),
    LoggerService:            Symbol.for("LoggerService"),

    // коммент
    CommentRouter:            Symbol.for("CommentRouter"),
    CommentsQueryRepo:        Symbol.for("CommentsQueryRepo"),
    CommentsDbRepo:           Symbol.for("CommentsDbRepo"),
    CommentService:           Symbol.for("CommentService"),

    // юзер
    UsersRouter:              Symbol.for("UsersRouter"),
    UserService:              Symbol.for("UserService"),
    UserQueryRepo:            Symbol.for("UserQueryRepo"),
    UserDbRepo:               Symbol.for("UserDbRepo"),

    // авторизация
    AuthRouter:               Symbol.for("AuthRouter"),
    PasswordRecoveryDbRepo:   Symbol.for("PasswordRecoveryDbRepo"),
    AuthService:              Symbol.for("AuthService"),
    JwtStrategy:              Symbol.for("JwtStrategy"),

    // тест
    TestingRouter:            Symbol.for("TestingRouter"),
    TestingDbRepo:            Symbol.for("TestingDbRepo"),

    // версель
    VercelRouter:             Symbol.for("VercelRouter"),

    // сессия
    SessionRouter:            Symbol.for("SessionRouter"),
    SecurityService:          Symbol.for("SecurityService"),
    SecurityDevicesDbRepo:    Symbol.for("SecurityDevicesDbRepo"),
    SecurityDevicesQueryRepo: Symbol.for("SecurityDevicesQueryRepo"),

    // пост
    PostRouter:               Symbol.for("PostRouter"),
    PostsQueryRepo:           Symbol.for("PostsQueryRepo"),
    PostService:              Symbol.for("PostService"),
    PostsDbRepo:              Symbol.for("PostsDbRepo"),

    // блог
    BlogRouter:               Symbol.for("BlogRouter"),
    BlogsQueryRepo:           Symbol.for("BlogsQueryRepo"),
    BlogService:              Symbol.for("BlogService"),
    BlogsDbRepo:              Symbol.for("BlogDbRepo"),
}