import {superConfig} from "../config/database.config";
import {Schema} from "mongoose";

export const mongoURI = String(superConfig.databaseUrl);

export const BlogSchema = new Schema({
    name:                   String,
    description:            String,
    websiteUrl:             String,
    createdAt:              Date,
    isMembership:           { type: Boolean, default: false },
}, { optimisticConcurrency: true });


export const PostSchema = new Schema({
    title:                  String,
    shortDescription:       String,
    content:                String,
    blogId:                 String,
    blogName:               String,
    createdAt:              Date,
    likesCount:             { type: Number,         required: true,     default: 0 },
    dislikesCount:          { type: Number,         required: true,     default: 0 },
}, { optimisticConcurrency: true });


export const UserSchema = new Schema({
    login:                  { type: String, lowercase: true },
    password:               String,
    email:                  { type: String, lowercase: true },
    createdAt:              Date,
    emailConfirmation: {
        confirmationCode:   { type: String, required: false },
        expirationDate:     { type: Date },
        isConfirmed:        { type: Boolean, required: true, default: false }
    }
}, { optimisticConcurrency: true });


export const CommentSchema = new Schema({
    content:                String,
    commentatorInfo: {
        userId:             String,
        userLogin:          String
    },
    createdAt:              Date,
    postId:                 String,
    likesCount:             { type: Number,         required: true,     default: 0 },
    dislikesCount:          { type: Number,         required: true,     default: 0 },
}, { optimisticConcurrency: true });

export const StatusSchema = new Schema({
    userId:                 { type: String, required: true },
    userLogin:              { type: String, required: true },
    // id коммента!
    parentId:               { type: String, required: true },
    status:                 { type: String, required: true, default: 'None' },
    createdAt:              { type: Date, required: true },
}, { optimisticConcurrency: true })

export const SessionSchema = new Schema({
    issuedAt:               Date,
    deviceId:               String,
    userId:                 String,
    ip:                     String,
    lastActiveDate:         Date,
    deviceName:             String,
    refreshToken:           String,
}, { optimisticConcurrency: true });

export const RecoveryPasswordSchema = new Schema({
    userId:                 String,
    recoveryCode:           String,
    expirationDate:         Date,
    used:                   {type: Boolean, default: false}
}, { optimisticConcurrency: true });
