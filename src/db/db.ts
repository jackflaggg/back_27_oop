import {superConfig} from "../config";
import mongoose from "mongoose";
import {SETTINGS} from "../settings";
import {UUID} from "mongodb";
import {randomUUID} from "node:crypto";

export const mongoURI = String(superConfig.databaseUrl);

const BlogSchema = new mongoose.Schema({
    name:                   String,
    description:            String,
    websiteUrl:             String,
    createdAt:              String,
    isMembership:           Boolean,
});
BlogSchema.set('autoIndex', false);

const PostSchema = new mongoose.Schema({
    title:                  String,
    shortDescription:       String,
    content:                String,
    blogId:                 String,
    blogName:               String,
    createdAt:              String,
});
PostSchema.set('autoIndex', false);

const UserSchema = new mongoose.Schema({
    login:                  String,
    password:               String,
    email:                  String,
    createdAt:              String,
    emailConfirmation: {
        confirmationCode:   { type: UUID, required: false, default: () => randomUUID() },
        expirationDate:     { type: Date },  // меняется на null
        isConfirmed:        { type: Boolean, required: true, default: false }
    }
});
UserSchema.set('autoIndex', false);

const CommentSchema = new mongoose.Schema({
    content:                String,
    commentatorInfo: {
        userId:             String,
        userLogin:          String
    },
    createdAt:              String,
    postId:                 String,
});
CommentSchema.set('autoIndex', false);

const RefreshSchema = new mongoose.Schema({
    refreshToken:           String
});
RefreshSchema.set('autoIndex', false);

const SessionSchema = new mongoose.Schema({
    issuedAt:               String,
    deviceId:               String,
    userId:                 String,
    ip:                     String,
    lastActiveDate:         String,
    deviceName:             String,
    refreshToken:           String,
});
SessionSchema.set('autoIndex', false);

const RecoveryPasswordSchema = new mongoose.Schema({
    userId:                 String,
    recoveryCode:           String,
    expirationDate:         Date
});
RecoveryPasswordSchema.set('autoIndex', false);

export const BlogModelClass             =    mongoose.model('Blogs', BlogSchema);
export const PostModelClass             =    mongoose.model('Posts', PostSchema);
export const UserModelClass             =    mongoose.model('Users', UserSchema);
export const CommentModelClass          =    mongoose.model('Comments', CommentSchema);
export const RefreshModelClass          =    mongoose.model('RefreshTokens', RefreshSchema);
export const SessionModelClass          =    mongoose.model('Sessions', SessionSchema);
export const RecoveryPasswordModelClass =    mongoose.model('RecoveryPasswords', RecoveryPasswordSchema);

export const connectToDB = async (port: number) => {
    try {
        await mongoose.connect(mongoURI,{dbName: SETTINGS.DB_NAME})
        console.log('connected to db')
    } catch (err: unknown) {
        console.log('Failed to connect to DB', String(err));
        await mongoose.disconnect();
        process.exit(1);
    }
}