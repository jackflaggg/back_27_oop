
export const TYPES = {

    LoggerService:                  Symbol.for("LoggerService"),

    CommentsQueryRepo:              Symbol.for("CommentsQueryRepo"),
    CommentsDbRepository:           Symbol.for("CommentsDbRepository"),
    CommentService:                 Symbol.for("CommentService"),
    CommentRouter:                  Symbol.for("CommentRouter"),

    UsersRouter:                    Symbol.for("UsersRouter"),
    UserService:                    Symbol.for("UserService"),
    UserQueryRepo:                  Symbol.for("UserQueryRepo"),
    UserDbRepository:               Symbol.for("UserDbRepository"),

    PasswordRecoveryDbRepository:   Symbol.for("PasswordRecoveryDbRepository"),

    AuthService:                    Symbol.for("AuthService"),

    JwtStrategy:                    Symbol.for("JwtStrategy"),
}