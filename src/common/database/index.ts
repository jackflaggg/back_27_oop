import {model} from "mongoose"
import {
    BlogSchema,
    CommentSchema,
    PostSchema,
    RecoveryPasswordSchema,
    SessionSchema, StatusSchema,
    UserSchema
} from "./database.module";


export const BlogModelClass             =    model('Blogs', BlogSchema)
export const PostModelClass             =    model('Posts', PostSchema);
export const UserModelClass             =    model('Users', UserSchema);
export const CommentModelClass          =    model('Comments', CommentSchema);
export const SessionModelClass          =    model('Sessions', SessionSchema);
export const RecoveryPasswordModelClass =    model('RecoveryPasswords', RecoveryPasswordSchema);
export const StatusModelClass           =    model('Status', StatusSchema);

