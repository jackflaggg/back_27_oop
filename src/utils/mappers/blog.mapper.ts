import {FlattenMaps} from 'mongoose'
import {OutBlogModel} from "../../models/blog/output/output.type.blogs";
import {ObjectId, WithId} from "mongodb";
import {BlogDbType} from "../../models/db/db.models";

export const blogMapper = (blog: WithId<BlogDbType>): OutBlogModel => ({
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
});

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