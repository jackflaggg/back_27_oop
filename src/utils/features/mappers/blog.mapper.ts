import {FlattenMaps} from "mongoose";
import {ObjectId} from "mongodb";

export function transformBlog(value: FlattenMaps<
    {
        createdAt?: string | null | undefined;
        name?: string | null | undefined;
        description?: string | null | undefined;
        websiteUrl?: string | null | undefined;
        isMembership?: boolean | null | undefined;
        _id: ObjectId}>) {
    return {
        id: String(value._id),
        createdAt: value.createdAt || '',
        name: value.name || '',
        description: value.description || '',
        websiteUrl: value.websiteUrl || '',
        isMembership: value.isMembership || false,
    }
}