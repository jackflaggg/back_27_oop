import {BlogModelClass, PostModelClass} from "../../db/db";
import {ObjectId} from "mongodb";
import {Post} from "../../dto/post/post.entity";

export class PostsDbRepository {
    async createPost(entity: Post) {
        return await PostModelClass.create(entity);
    }
    async updatePost(entity: any, id: string) {

    }
    async deletePost(id: string) {

    }
    async findBlog(blogId: string){
        const result = await BlogModelClass.findOne({_id: new ObjectId(blogId)});
        if (!result){
            return;
        }
        return result;
    }
}