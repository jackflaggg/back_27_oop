import {FlattenMaps} from "mongoose";
import {ObjectId} from "mongodb";
import {BlogOutInterface} from "../../../module/blog/models/blog.models";

export function transformBlog(value: FlattenMaps<
    {
        createdAt?: Date | null | undefined;
        name?: string | null | undefined;
        description?: string | null | undefined;
        websiteUrl?: string | null | undefined;
        isMembership?: boolean | null | undefined;
        _id: ObjectId}>): BlogOutInterface {
    return {
        id: String(value._id),
        name: value.name || '',
        description: value.description || '',
        websiteUrl: value.websiteUrl || '',
        isMembership: value.isMembership || false,
    }
}