import {PostModelClass} from "../../db/db";
import {ObjectId} from "mongodb";
import {InCreatePostModel, InUpdatePostModel} from "../../models/post/input/input.type.posts";

export const postsRepository = {
    async createPost(post: InCreatePostModel): Promise<string | null> {
        const newPost = await PostModelClass.insertMany([post]);

        if (!newPost || !newPost[0]._id) {
            return null;
        }

        return newPost[0]._id.toString();
    },
    async putPost(post: InUpdatePostModel, id: string): Promise<boolean> {
        const updatePost = await PostModelClass.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId
            }
        }, {upsert: true});

        return updatePost.modifiedCount === 1;
    },
    async delPost(id: string): Promise<boolean> {
        const deletePost = await PostModelClass.deleteOne({_id: new ObjectId(id)});
        return deletePost.deletedCount === 1;
    }
}