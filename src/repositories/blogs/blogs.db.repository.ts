import {BlogModelClass, PostModelClass,} from "../../db/db";
import {ObjectId} from "mongodb";
import {BlogDbType} from "../../models/db/db.models";
import {InCreatePostToBlogModel, InUpdateBlogModel} from "../../models/blog/input/input.type.blogs";

export const blogsRepositories = {
    async createBlog(blog: BlogDbType): Promise<string>{
        const newBlog = await BlogModelClass.insertMany(blog)
        return newBlog[0]._id.toString();
    },

    async putBlog(blogId: string, blog: InUpdateBlogModel): Promise<boolean> {
        const updateBlog = await BlogModelClass.updateOne({_id: new ObjectId(blogId)}, {
                $set: {
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                }
            }, {upsert: true});

        const { acknowledged, modifiedCount} = updateBlog;

        return acknowledged && Boolean(modifiedCount);
    },
    async delBlog(blogId: string): Promise<boolean> {
        const deleteBlog = await BlogModelClass.deleteOne({_id: new ObjectId(blogId)});

        return deleteBlog.acknowledged;
    },

    async createPostToBlogID(blogId: string, bodyPost: InCreatePostToBlogModel): Promise<null | string> {
        const blog = await BlogModelClass.findOne({_id: new ObjectId(blogId)});

        if (!blog){
            return null;
        }

        const newPost = await PostModelClass.insertMany([bodyPost]);

        return newPost[0]._id.toString();

    }
}
