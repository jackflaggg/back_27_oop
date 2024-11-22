import {superConfig} from "../config";
import mongoose, {Schema, model} from "mongoose";
import {SETTINGS} from "../settings";
import {LoggerService} from "../utils/logger/logger.service";
import {initPlugin} from "../utils/features/db/init.plugin";

export const mongoURI = String(superConfig.databaseUrl);

// https://mongoosejs.com/docs/schematypes.html

// 2 TODO: Нужно ли зарегать плагин глобально, чтоб вместо _id было id
// https://nesin.io/blog/create-mongoosejs-plugin


const BlogSchema = new Schema({
    name:                   String,
    description:            String,
    websiteUrl:             String,
    createdAt:              String,
    isMembership:           { type: Boolean, default: false },
}, { optimisticConcurrency: true });


const PostSchema = new Schema({
    title:                  String,
    shortDescription:       String,
    content:                String,
    blogId:                 String,
    blogName:               String,
    createdAt:              String,
}, { autoIndex: false});


const UserSchema = new Schema({
    login:                  { type: String, lowercase: true },
    password:               String,
    email:                  { type: String, lowercase: true },
    createdAt:              String,
    emailConfirmation: {
        confirmationCode:   { type: String, required: false },
        expirationDate:     { type: Date },  // меняется на null
        isConfirmed:        { type: Boolean, required: true, default: false }
    }
}, {
    virtuals: {
        fullName: {
            get() {
                    return this.login + ' : ' + this.email;
            }
        }
    }
});


const CommentSchema = new Schema({
    content:                String,
    commentatorInfo: {
        userId:             String,
        userLogin:          String
    },
    createdAt:              String,
    postId:                 String,
}, { optimisticConcurrency: true });

const RefreshSchema = new Schema({
    refreshToken:           String
}, { optimisticConcurrency: true });


const SessionSchema = new Schema({
    issuedAt:               String,
    deviceId:               String,
    userId:                 String,
    ip:                     String,
    lastActiveDate:         String,
    deviceName:             String,
    refreshToken:           String,
}, { optimisticConcurrency: true });

const RecoveryPasswordSchema = new Schema({
    userId:                 String,
    recoveryCode:           String,
    expirationDate:         Date
}, { optimisticConcurrency: true });


initPlugin([
    BlogSchema,
    PostSchema,
    UserSchema,
    CommentSchema,
    RefreshSchema,
    SessionSchema,
    RecoveryPasswordSchema,
]);

export const BlogModelClass             =    model('Blogs', BlogSchema)
export const PostModelClass             =    model('Posts', PostSchema);
export const UserModelClass             =    model('Users', UserSchema);
export const CommentModelClass          =    model('Comments', CommentSchema);
export const RefreshModelClass          =    model('RefreshTokens', RefreshSchema);
export const SessionModelClass          =    model('Sessions', SessionSchema);
export const RecoveryPasswordModelClass =    model('RecoveryPasswords', RecoveryPasswordSchema);


export class MongooseService {

    constructor(private logger: LoggerService) {}

    public async connect(): Promise<void> {
        try {
            await mongoose.connect(mongoURI, {
                dbName: SETTINGS.DB_NAME,
                sanitizeFilter: false
            });
            this.logger.log('Успешное подключение к базе данных!');
        } catch(error: unknown) {
            this.logger.error('База рухнула! ' + String(error));
            await this.disconnect();
            process.exit(1);
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            this.logger.log('Успешное отключение!');
        } catch(error: unknown) {
            if (error instanceof Error) {
                this.logger.error('рухнул дисконнект! ' + String(error));
            }
            this.logger.error('Boom!  ' + String(error));
        }

    }
}