import {VercelRouter} from "../../module/vercel/vercel.router";
import {SecurityService} from "../../module/security/security.service";
import {SecurityDevicesDbRepository} from "../../module/security/security.devices.db.repository";
import {SecurityDevicesQueryRepository} from "../../module/security/security.devices.query.repository";

export const TYPES = {
    MongooseService:          Symbol.for("MongooseService"),
    LoggerService:            Symbol.for("LoggerService"),

    CommentsQueryRepo:        Symbol.for("CommentsQueryRepo"),
    CommentsDbRepo:           Symbol.for("CommentsDbRepo"),
    CommentService:           Symbol.for("CommentService"),
    CommentRouter:            Symbol.for("CommentRouter"),

    UsersRouter:              Symbol.for("UsersRouter"),
    UserService:              Symbol.for("UserService"),
    UserQueryRepo:            Symbol.for("UserQueryRepo"),
    UserDbRepo:               Symbol.for("UserDbRepo"),

    PasswordRecoveryDbRepo:   Symbol.for("PasswordRecoveryDbRepo"),
    AuthService:              Symbol.for("AuthService"),
    JwtStrategy:              Symbol.for("JwtStrategy"),
    AuthRouter:               Symbol.for("AuthRouter"),

    TestingDbRepo:            Symbol.for("TestingDbRepo"),
    TestingRouter:            Symbol.for("TestingRouter"),

    VercelRouter:             Symbol.for("VercelRouter"),

    SessionRouter:            Symbol.for("SessionRouter"),
    SecurityService:          Symbol.for("SecurityService"),
    SecurityDevicesDbRepo:    Symbol.for("SecurityDevicesDbRepo"),
    SecurityDevicesQueryRepo: Symbol.for("SecurityDevicesQueryRepo"),
}