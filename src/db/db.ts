import {superConfig} from "../config";
import mongoose, {Model, Schema, model} from "mongoose";
import {SETTINGS} from "../settings";
import {UUID} from "mongodb";
import {randomUUID} from "node:crypto";

export const mongoURI = String(superConfig.databaseUrl);


// 1 TODO: Есть ли необходимость добавлять внутренние валидаторы мангуса, если уже есть валадиатор экспресса?
// https://mongoosejs.com/docs/schematypes.html

// 2 TODO: Нужно ли зарегать плагин глобально, чтоб вместо _id было id
// https://nesin.io/blog/create-mongoosejs-plugin


// 3 TODO: Почему нельзя версионирование ключа с оптимист параллелизмом включать

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

export const BlogModelClass             =    model('Blogs', BlogSchema);
export const PostModelClass             =    model('Posts', PostSchema);
export const UserModelClass             =    model('Users', UserSchema);
export const CommentModelClass          =    model('Comments', CommentSchema);
export const RefreshModelClass          =    model('RefreshTokens', RefreshSchema);
export const SessionModelClass          =    model('Sessions', SessionSchema);
export const RecoveryPasswordModelClass =    model('RecoveryPasswords', RecoveryPasswordSchema);

export const connectToDB = async (port: number) => {
    try {
        await mongoose.connect(mongoURI,{dbName: SETTINGS.DB_NAME});
        console.log('connected to db');
    } catch (err: unknown) {
        console.log('Failed to connect to DB', String(err));
        await mongoose.disconnect();
        process.exit(1);
    }
}