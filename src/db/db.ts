import {Db, MongoClient} from "mongodb";
import {
    BlogDbType,
    CommentDbType,
    PostDbType, RefreshTokenType, SessionCollection,
    UserDbType
} from "../models/db/db.models";
import {SETTINGS} from "../settings";
import {superConfig} from "../config";
import mongoose from "mongoose";

export const mongoURI = superConfig.databaseUrl;
const client: MongoClient = new MongoClient(mongoURI!);

export const database: Db = client.db(SETTINGS.DB_NAME);

const blogSchema = new mongoose.Schema({
    // id?:            String,
    name:           String,
    description:    String,
    websiteUrl:     String,
    createdAt:      String,
    isMembership:   Boolean,
});

const postSchema = new mongoose.Schema({
    title:              String,
    shortDescription:   String,
    content:            String,
    blogId:             String,
    blogName:           String,
    createdAt:          String,
});

const userSchema = new mongoose.Schema({
        login:                  String,
        password:               String,
        email:                  String,
        createdAt:              String,
        emailConfirmation:      {
            confirmationCode: { type: String, required: false },
            // меняется на null
            expirationDate: { type: Date },
            isConfirmed: { type: Boolean, required: true, default: false }
        }
});

const commentSchema = new mongoose.Schema({
    content:            String,
    commentatorInfo:    {
        userId:         String,
        userLogin:      String
    },
    createdAt:          String,
    postId:             String,
});

const refreshSchema = new mongoose.Schema({
    refreshToken:   String
});

const sessionSchema = new mongoose.Schema({
    issuedAt:           String,
    deviceId:           String,
    userId:             String,
    ip:                 String,
    lastActiveDate:     String,
    deviceName:         String,
    refreshToken:       String,
});

const RecoveryPasswordSchema = new mongoose.Schema({
    userId: String,
    recoveryCode: String,
    expirationDate: Date
});

// export const blogsCollections = database.collection<BlogDbType>(SETTINGS.COLLECTION_BLOGS!);
// export const postsCollections = database.collection<PostDbType>(SETTINGS.COLLECTION_POSTS!);
// export const usersCollection = database.collection<UserDbType>(SETTINGS.COLLECTION_USERS!);
// export const commentsCollection = database.collection<CommentDbType>(SETTINGS.COLLECTION_COMMENTS!);
// export const refreshTokenCollection = database.collection<RefreshTokenType>(SETTINGS.COLLECTION_TOKEN!)
// export const sessionCollection = database.collection<SessionCollection>(SETTINGS.COLLECTION_API!);

export const blogModel = mongoose.model('blogs', blogSchema);
export const postModel = mongoose.model('posts', postSchema);
export const userModel = mongoose.model('users', userSchema);
export const commentModel = mongoose.model('comments', commentSchema);
export const refreshModel = mongoose.model('refreshTokens', refreshSchema);
export const sessionModel = mongoose.model('sessions', sessionSchema);
export const RecoveryPasswordModel = mongoose.model('recoveryPasswords', RecoveryPasswordSchema);

export const connectToDB = async (port: number) => {
    try {
        await mongoose.connect(mongoURI!)
        console.log('connected to db')
    } catch (err) {
        console.log('Failed to connect to DB', String(err));
        await mongoose.disconnect();
        process.exit(1);
    }
}