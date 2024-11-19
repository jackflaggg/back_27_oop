import {BlogModelClass, PostModelClass,} from "../../db/db";
import {ObjectId} from "mongodb";
import {BlogDbType} from "../../models/db/db.models";
import {InCreatePostToBlogModel, InUpdateBlogModel} from "../../models/blog/input/input.type.blogs";

export const blogsRepositories = {
    async createBlog(blog: BlogDbType): Promise<string | null>{
        const newBlog = await BlogModelClass.insertMany([blog])
        if (!newBlog[0]) {
            return null;
        }
        console.log('это возвращает в insert: ' + newBlog)
        return newBlog[0]._id.toString();
    },

    async putBlog(blogId: string, blog: InUpdateBlogModel): Promise<boolean> {
        const updateBlog = await BlogModelClass.updateOne({_id: new ObjectId(blogId)}, {
                $set: {
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                }
            }, {upsert: true})
        console.log('так выглядит обновленный объект: ' + updateBlog)
            return true/*updateBlog && updateBlog.acknowledged*/
    },
    async delBlog(blogId: string): Promise<boolean> {
        const deleteBlog = await BlogModelClass.deleteOne({_id: new ObjectId(blogId)});
        console.log('так выглядит удаляемый блог: ' + deleteBlog)
        return true/*deleteBlog.acknowledged;*/
    },

    async createPostToBlogID(blogId: string, bodyPost: InCreatePostToBlogModel): Promise<null | string> {
        const blog = await BlogModelClass.findOne({_id: new ObjectId(blogId)});

        if (!blog){
            return null;
        }
        console.log('так выглядит найденный блог: ' + blog)
        const newPost = await PostModelClass.insertMany([bodyPost]);
        console.log('так выглядит вставка в коллекцию постов: ' + newPost)
        return newPost[0]._id.toString();

    }
}
