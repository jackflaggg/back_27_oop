import {superConfig} from "../config";
import mongoose, {Schema, model} from "mongoose";
import {SETTINGS} from "../settings";
import {LoggerService} from "../utils/logger/logger.service";

export const mongoURI = String(superConfig.databaseUrl);

const BlogSchema = new Schema({
    name:                   String,
    description:            String,
    websiteUrl:             String,
    createdAt:              Date,
    isMembership:           { type: Boolean, default: false },
}, { optimisticConcurrency: true });


const PostSchema = new Schema({
    title:                  String,
    shortDescription:       String,
    content:                String,
    blogId:                 String,
    blogName:               String,
    createdAt:              Date,
}, { autoIndex: false});


const UserSchema = new Schema({
    login:                  { type: String, lowercase: true },
    password:               String,
    email:                  { type: String, lowercase: true },
    createdAt:              Date,
    emailConfirmation: {
        confirmationCode:   { type: String, required: false },
        expirationDate:     { type: Date },  // меняется на null
        isConfirmed:        { type: Boolean, required: true, default: false }
    }
}, { optimisticConcurrency: true });


const CommentSchema = new Schema({
    content:                String,
    commentatorInfo: {
        userId:             String,
        userLogin:          String
    },
    createdAt:              Date,
    postId:                 String,
}, { optimisticConcurrency: true });

const SessionSchema = new Schema({
    issuedAt:               Date,
    deviceId:               String,
    userId:                 String,
    ip:                     String,
    lastActiveDate:         Date,
    deviceName:             String,
    refreshToken:           String,
}, { optimisticConcurrency: true });

const RecoveryPasswordSchema = new Schema({
    userId:                 String,
    recoveryCode:           String,
    expirationDate:         Date
}, { optimisticConcurrency: true });


export const BlogModelClass             =    model('Blogs', BlogSchema)
export const PostModelClass             =    model('Posts', PostSchema);
export const UserModelClass             =    model('Users', UserSchema);
export const CommentModelClass          =    model('Comments', CommentSchema);
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