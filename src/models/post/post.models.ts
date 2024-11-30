import {ObjectId} from "mongodb";

export interface CreatePostInterface {
    title: string,
    shortDescription: string,
    content: string,
    blogId: ObjectId,
    blogName: string,
    createdAt: string
}