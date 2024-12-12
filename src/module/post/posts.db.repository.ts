import {BlogModelClass, PostModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {Post} from "./dto/post.entity";
import {PostUpdateDto} from "./dto/post.update.dto";
import {transformPost} from "../../common/utils/mappers/post.mapper";
import {blogMapper, postMapper} from "../../common/utils/features/query.helper";

export class PostsDbRepository {
    async createPost(entity: Post) {
        const post = await PostModelClass.create(entity);
        return transformPost(post);
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
        return blogMapper(result);
    }
    async findPost(postId: string){
        const result = await PostModelClass.findOne({_id: new ObjectId(postId)});
        if (!result){
            return;
        }
        return postMapper(result);
    }
}