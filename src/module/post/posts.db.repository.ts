import {BlogModelClass, PostModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {Post} from "./dto/post.entity";
import {PostUpdateDto} from "./dto/post.update.dto";

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
    async deletePost(postId: string) {
        const result = await BlogModelClass.deleteOne({_id: new ObjectId(postId)});
        return result.deletedCount === 1;
    }
    async findBlog(blogId: string){
        const result = await BlogModelClass.findOne({_id: new ObjectId(blogId)});
        if (!result){
            return;
        }
        return result;
    }
    async findPost(postId: string){
        const result = await PostModelClass.findOne({_id: new ObjectId(postId)});
        if (!result){
            return;
        }
        return result;
    }
}