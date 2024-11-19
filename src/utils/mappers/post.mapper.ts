import {ObjectId, WithId} from "mongodb";
import {PostDbType} from "../../models/db/db.models";
import {OutPostModel} from "../../models/post/output/output.type.posts";
import {FlattenMaps} from "mongoose";

export const postMapper = (post: WithId<PostDbType>): OutPostModel => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogName: post.blogName,
        createdAt: post.createdAt,
        blogId: post.blogId
})

export function transformPost(value: FlattenMaps<
    {
            title?: string | null | undefined;
            shortDescription?: string | null | undefined;
            content?: string | null | undefined;
            blogId?: string | null | undefined;
            blogName?: boolean | null | undefined;
            createdAt?: boolean | null | undefined;
            _id: ObjectId}>) {
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