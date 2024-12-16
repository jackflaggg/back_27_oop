import {BlogModelClass, CommentModelClass, PostModelClass, StatusModelClass} from "../../common/database";
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
import {likeViewModel} from "../like/models/like.models";
import {commentEntityViewModel} from "../comment/models/comment.models";

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
    async findPost(postId: string, userId?: ObjectId): Promise<any | postMapperInterface | void> {
        const result = await PostModelClass.findOne({_id: new ObjectId(postId)});
        if (!result){
            return;
        }
        const status = userId ? await StatusModelClass.findOne({userId, parentId: postId}) : null;
        return transformPost(result);
    }
    async updateLikeStatus(postId: string, userId: ObjectId, status: string): Promise<boolean> {
        const updateResult = await StatusModelClass.updateOne({userId, parentId: new ObjectId(postId)}, {status});
        return updateResult.matchedCount === 1;
    }
    async createLikeStatus(dtoLike: likeViewModel): Promise<string>{
        const createResult = await StatusModelClass.create(dtoLike);
        return createResult._id.toString()
    }
    async getStatusPost(postId: string, userId: ObjectId/*, status: string*/): Promise<string | void> {
        const statusResult = await StatusModelClass.findOne({parentId: new ObjectId(postId), userId/*, status*/});
        if (!statusResult){
            return;
        }
        return statusResult.status;
    }
    async updateCountStatusesPost(postId: string, dto: Pick<commentEntityViewModel, 'likesCount' | 'dislikesCount'>){
        const updateResult = await PostModelClass.updateOne({_id: new ObjectId(postId)}, dto);
        return updateResult.matchedCount === 1;
    }
}