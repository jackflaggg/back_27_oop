import {BlogModelClass, PostModelClass} from "../../db/db";
import {ObjectId} from "mongodb";
import {Post} from "../../dto/post/post.entity";
import {PostUpdateDto} from "../../dto/post/post.update.dto";

export class PostsDbRepository {
    async createPost(entity: Post) {
        return await PostModelClass.create(entity);
    }
    async updatePost(postDto: PostUpdateDto) {
        const {title, shortDescription, content, blogId} = postDto;
        const blog = await BlogModelClass.updateOne({
            title, shortDescription, content, blogId
        })
        return blog.modifiedCount === 1;
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