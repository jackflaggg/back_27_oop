import {nameErr} from "../../common/types/common";
import {validateId} from "../../common/utils/validators/params.validator";
import {PostCreateDto} from "./dto/post.create.dto";
import {Post} from "./dto/post.entity";
import {PostUpdateDto} from "./dto/post.update.dto";
import {CommentCreateDto} from "../comment/dto/comment.create.dto";
import {Comment} from "../comment/dto/comment.entity";
import {PostsDbRepository} from "./posts.db.repository";
import {CommentsDbRepository} from "../comment/comments.db.repository";
import {ThrowError} from "../../common/utils/errors/custom.errors";
import {userInterface} from "../user/models/user.models";
import {inject, injectable} from "inversify";
import {TYPES} from "../../common/types/types";
import {blogMapperInterface} from "../../common/utils/features/query.helper";
import {commentEntityViewModel, commentStatus, transformCommentToGetInterface} from "../comment/models/comment.models";
import {transformPostInterface} from "../../common/utils/mappers/post.mapper";
import {postServiceInterface} from "./models/post.models";
import {UniversalStatusDto} from "../comment/dto/comment.like-status.dto";
import {StatusLikeDislikeNone} from "../like/dto/status.create.dto";
import {statuses} from "../like/models/like.models";

@injectable()
export class PostService implements postServiceInterface {
    constructor(@inject(TYPES.PostsDbRepo) private postRepository: PostsDbRepository,
                @inject(TYPES.CommentsDbRepo) private commentRepository: CommentsDbRepository) {
    }
    async createPost(postDto: PostCreateDto): Promise<transformPostInterface> {
        const checkBlog = await this.validateBlog(postDto.blogId);
        const post = new Post(postDto.title, postDto.shortDescription, postDto.content, checkBlog.id, checkBlog.name);

        return await this.postRepository.createPost(post);
    }

    async updatePost(postDto: PostUpdateDto): Promise<boolean> {
        await this.validateBlog(postDto.blogId);

        return await this.postRepository.updatePost(postDto);

    }

    async deletePost(postId: string): Promise<boolean> {
        return await this.postRepository.deletePost(postId);
    }

    async validateBlog(blogId: string): Promise<blogMapperInterface>{
        validateId(blogId);

        const existBlog = await this.postRepository.findBlog(blogId);

        if (!existBlog){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'блог не найден', field: '[BlogDbRepository]'}])
        }
        return existBlog as blogMapperInterface;
    }

    async createComment(postId: string, commentDto: CommentCreateDto, user: userInterface): Promise<transformCommentToGetInterface | void> {
        const post = await this.postRepository.findPost(postId);

        if (!post){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'пост не найден', field: '[postRepository]'}])
        }

        const comment = new Comment(commentDto.content, {userId: user.userId, userLogin: user.userLogin}, postId);

        const dateComment = comment.viewModel();

        const createComment = await this.commentRepository.createComment(dateComment);

        return await this.commentRepository.findCommentById(createComment.id)
    }

    async updateStatus(statusDto: UniversalStatusDto, postId: string, user: userInterface): Promise<any> {
        const postResult = await this.postRepository.findPost(postId)

        if (!postResult){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: '[postRepository] пост не найден', field: '[postRepository]'}]);
        }

        const currentStatuses = await this.postRepository.getStatusPost(postId, user.userId, statusDto.likeStatus);

        let dislike: number = 0;
        let like: number = 0;

        if (currentStatuses){
            await this.postRepository.updateLikeStatus(postId, user.userId, statusDto.likeStatus);

            const { dislikesCount, likesCount } = this.parsingStatusPost(currentStatuses, statusDto.likeStatus);
            dislike = dislikesCount;
            like = likesCount;
        } else {
            const newStatus = new StatusLikeDislikeNone(
                user.userId,
                user.userLogin,
                postId,
                statusDto.likeStatus);

            const viewStatus = newStatus.viewModel();

            await this.postRepository.createLikeStatus(viewStatus);

            like = statusDto.likeStatus === statuses.LIKE ? 1 : 0;
            dislike = statusDto.likeStatus === statuses.DISLIKE ? 1 : 0;
        }

        const likesCount = postResult.likesCount + like;

        console.log('1: ' +  likesCount)
        const dislikesCount = postResult.dislikesCount + dislike;
        console.log('2: ' +  dislikesCount)
        const updatedComment: Pick<commentEntityViewModel, 'likesCount' | 'dislikesCount'> = {
            likesCount: likesCount >= 0 ? likesCount : 0,
            dislikesCount: dislikesCount >= 0 ? dislikesCount : 0,
        }
        console.log('3: ' +  updatedComment.likesCount, updatedComment.dislikesCount)
        await this.postRepository.updateCountStatusesPost(postId, updatedComment);
    }
    parsingStatusPost(currentStatus: string, changedStatus: string): Pick<commentEntityViewModel, 'likesCount' | 'dislikesCount'> {
        let likesCount = 0
        let dislikesCount = 0

        if (currentStatus === commentStatus.LIKE && changedStatus === commentStatus.DISLIKE) {
            likesCount = -1
            dislikesCount = 1
        }

        if (currentStatus === commentStatus.LIKE && changedStatus === commentStatus.NONE) {
            likesCount = -1
            dislikesCount = 0
        }

        if (currentStatus === commentStatus.DISLIKE && changedStatus === commentStatus.NONE) {
            likesCount = 0
            dislikesCount = -1
        }

        if (currentStatus === commentStatus.DISLIKE && changedStatus === commentStatus.LIKE) {
            likesCount = 1
            dislikesCount = -1
        }

        if (currentStatus === commentStatus.NONE && changedStatus === commentStatus.LIKE) {
            likesCount = 1
            dislikesCount = 0
        }

        if (currentStatus === commentStatus.NONE && changedStatus === commentStatus.DISLIKE) {
            likesCount = 0
            dislikesCount = -1
        }

        // if (currentStatus === commentStatus.DISLIKE && changedStatus === commentStatus.DISLIKE) {
        //     likesCount = 0
        //     dislikesCount = -1
        // }
        //
        // if (currentStatus === commentStatus.LIKE && changedStatus === commentStatus.LIKE) {
        //     likesCount = -1
        //     dislikesCount = 0
        // }

        return { likesCount, dislikesCount }
    }
}