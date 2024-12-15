import {BlogModelClass, PostModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {Post} from "./dto/post.entity";
import {PostUpdateDto} from "./dto/post.update.dto";
import {transformPost, transformPostInterface} from "../../common/utils/mappers/post.mapper";
import {
    blogMapper,
    blogMapperInterface,
    postMapper,
    postMapperInterface
} from "../../common/utils/features/query.helper";
import {postDbRepositoryInterface} from "./models/post.models";

export class PostsDbRepository implements postDbRepositoryInterface {
    async createPost(entity: Post): Promise<transformPostInterface> {
        const post = await PostModelClass.create(entity);
        return transformPost(post);
    }
    async updatePost(postDto: PostUpdateDto): Promise<boolean> {
        const {title, shortDescription, content, blogId} = postDto;
        const blog = await BlogModelClass.updateOne({
            title, shortDescription, content, blogId
        })
        return blog.modifiedCount === 1;
    }
    async deletePost(postId: string): Promise<boolean> {
        const result = await BlogModelClass.deleteOne({_id: new ObjectId(postId)});
        return result.deletedCount === 1;
    }
    async findBlog(blogId: string): Promise<blogMapperInterface | void> {
        const result = await BlogModelClass.findOne({_id: new ObjectId(blogId)});
        if (!result){
            return;
        }
        return blogMapper(result);
    }
    async findPost(postId: string): Promise<postMapperInterface | void> {
        const result = await PostModelClass.findOne({_id: new ObjectId(postId)});
        if (!result){
            return;
        }
        return postMapper(result);
    }
}