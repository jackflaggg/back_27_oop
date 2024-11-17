import {superConfig} from "../config";
import mongoose from "mongoose";
import {SETTINGS} from "../settings";

export const mongoURI = superConfig.databaseUrl;

const blogSchema = new mongoose.Schema({
    name:                   String,
    description:            String,
    websiteUrl:             String,
    createdAt:              String,
    isMembership:           Boolean,
});

const postSchema = new mongoose.Schema({
    title:                  String,
    shortDescription:       String,
    content:                String,
    blogId:                 String,
    blogName:               String,
    createdAt:              String,
});

const userSchema = new mongoose.Schema({
    login:                  String,
    password:               String,
    email:                  String,
    createdAt:              String,
    emailConfirmation: {
        confirmationCode:   { type: String, required: false },
        expirationDate:     { type: Date },  // меняется на null
        isConfirmed:        { type: Boolean, required: true, default: false }
    }
});

const commentSchema = new mongoose.Schema({
    content:                String,
    commentatorInfo: {
        userId:             String,
        userLogin:          String
    },
    createdAt:              String,
    postId:                 String,
});

const refreshSchema = new mongoose.Schema({
    refreshToken:           String
});

const sessionSchema = new mongoose.Schema({
    issuedAt:               String,
    deviceId:               String,
    userId:                 String,
    ip:                     String,
    lastActiveDate:         String,
    deviceName:             String,
    refreshToken:           String,
});

const RecoveryPasswordSchema = new mongoose.Schema({
    userId:                 String,
    recoveryCode:           String,
    expirationDate:         Date
});

export const blogModel             =    mongoose.model('blogs', blogSchema);
export const postModel             =    mongoose.model('posts', postSchema);
export const userModel             =    mongoose.model('users', userSchema);
export const commentModel          =    mongoose.model('comments', commentSchema);
export const refreshModel          =    mongoose.model('refreshTokens', refreshSchema);
export const sessionModel          =    mongoose.model('sessions', sessionSchema);
export const RecoveryPasswordModel =    mongoose.model('recoveryPasswords', RecoveryPasswordSchema);

export const connectToDB = async (port: number) => {
    try {
        await mongoose.connect(mongoURI!,{dbName: SETTINGS.DB_NAME})
        console.log('connected to db')
    } catch (err: unknown) {
        console.log('Failed to connect to DB', String(err));
        await mongoose.disconnect();
        process.exit(1);
    }
}