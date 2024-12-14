import {validateId} from "../../common/utils/validators/params.validator";
import {ObjectId} from "mongodb";
import {nameErr} from "../../models/common";
import {CommentCreateDto} from "./dto/comment.create.dto";
import {ThrowError} from "../../common/utils/errors/custom.errors";
import {inject, injectable} from "inversify";
import {userInterface} from "../../models/user/user.models";
import {commentsDbRepoInterface, commentServiceInterface, commentStatus} from "../../models/comment/comment.models";
import {TYPES} from "../../models/types/types";
import {CommentStatusDto} from "./dto/comment.like-status.dto";
import {StatusLikeDislikeNone} from "../like/dto/status.create.dto";
import {statuses} from "../../models/like/like.models";
import {Comment} from "./dto/comment.entity";

@injectable()
export class CommentService implements commentServiceInterface {
    constructor(@inject(TYPES.CommentsDbRepo) private readonly commentsDbRepository: commentsDbRepoInterface) {}
    async deleteComment(commentId: string, user: userInterface): Promise<boolean> {

        await this.validateCommentAndCheckUser(commentId, user);

        return await this.commentsDbRepository.deleteComment(commentId);
    }

    async updateComment(commentId: string, contentDto: CommentCreateDto, user: userInterface): Promise<boolean>{
        await this.validateCommentAndCheckUser(commentId, user);
        return await this.commentsDbRepository.updateContentComment(commentId, contentDto.content);
    }

    async updateStatuses(statusDto: CommentStatusDto, commentId: string, userDate: userInterface): Promise<void> {

        await this.validateCommentAndCheckUser(commentId, userDate);

        const commentResult = await this.commentsDbRepository.findCommentById(new ObjectId(commentId));

        const currentStatuses = await this.commentsDbRepository.getCommentStatuses(commentId, userDate.userId);

        let dislike: number = 0;
        let like: number = 0;

        if (currentStatuses){
            const updatedLikeStatusDto = {
                userId: currentStatuses.userId,
                userLogin: currentStatuses.userLogin,
                parentId: currentStatuses.parentId,
                status: statusDto.likeStatus,
                createdAt: currentStatuses.createdAt,
            }

            await this.commentsDbRepository.updateLikeStatus(updatedLikeStatusDto);
            const { dislikesCount, likesCount } = this.parsingStatus(currentStatuses.status, statusDto.likeStatus);
            dislike = dislikesCount;
            like = likesCount;
        } else {
            const newStatus = new StatusLikeDislikeNone(
                userDate.userId,
                userDate.userLogin,
                commentId,
                statusDto.likeStatus);

            await this.commentsDbRepository.createLikeStatus(newStatus);

            like = statusDto.likeStatus === statuses.LIKE ? 1 : 0;
            dislike = statusDto.likeStatus === statuses.DISLIKE ? 1 : 0;
        }

        const likesCount = commentResult!.likesInfo.likesCount + like;
        const dislikesCount = commentResult!.likesInfo.dislikesCount + dislike
        const updatedComment = {
            postId: commentResult!.postId,
            content: commentResult!.content,
            commentatorInfo: commentResult!.commentatorInfo,
            createdAt: commentResult!.createdAt,
            likesCount: likesCount >= 0 ? likesCount : 0,
            dislikesCount: dislikesCount >= 0 ? dislikesCount : 0,
        }
        await this.commentsDbRepository.updateAllComment(updatedComment);
    }

    async validateCommentAndCheckUser(commentId: string, user: userInterface): Promise<void> {

        validateId(commentId);

        const comment = await this.commentsDbRepository.findCommentById(new ObjectId(commentId));
        if (!comment) {
            throw new ThrowError(nameErr['NOT_FOUND']);
        }

        if (user.userId.toString() !== comment.commentatorInfo.userId){
            throw new ThrowError(nameErr['NOT_FORBIDDEN']);
        }
    }

    parsingStatus(currentStatus: string, changedStatus: string) {
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

        return { likesCount, dislikesCount }
    }
}