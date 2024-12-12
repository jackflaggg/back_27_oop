import {FlattenMaps} from "mongoose";
import {ObjectId} from "mongodb";
export interface transformPostInterface {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date | string,
}

export function transformPost(value: FlattenMaps<
    {
        title?: string | null | undefined;
        shortDescription?: string | null | undefined;
        content?: string | null | undefined;
        blogId?: string | null | undefined;
        blogName?: string | null | undefined;
        createdAt?: Date | null | undefined;
        _id: ObjectId}>): transformPostInterface {
    return {
        id: String(value._id),
        title: value.title || '',
        shortDescription: value.shortDescription || '',
        content: value.content || '',
        blogId: value.blogId || '',
        blogName: value.blogName || '',
        createdAt: value.createdAt || '',
    }
}