import {validateId} from "../../common/utils/validators/params.validator";
import {nameErr} from "../../common/types/common";
import {CommentCreateDto} from "./dto/comment.create.dto";
import {ThrowError} from "../../common/utils/errors/custom.errors";
import {inject, injectable} from "inversify";
import {userInterface} from "../user/models/user.models";
import {
    commentEntityViewModel,
    commentsDbRepoInterface,
    commentServiceInterface,
    commentStatus
} from "./models/comment.models";
import {TYPES} from "../../common/types/types";
import {UniversalStatusDto} from "./dto/comment.like-status.dto";
import {StatusLikeDislikeNone} from "../like/dto/status.create.dto";
import {statuses} from "../like/models/like.models";

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

    async updateStatuses(statusDto: UniversalStatusDto, commentId: string, userDate: userInterface): Promise<void> {

        const commentResult = await this.commentsDbRepository.findCommentById(commentId);

        if (!commentResult){
            throw new ThrowError(nameErr['NOT_FOUND']);
        }

        const currentStatuses = await this.commentsDbRepository.getStatusComment(commentId, userDate.userId);

        let dislike: number = 0;
        let like: number = 0;

        if (currentStatuses){

            await this.commentsDbRepository.updateLikeStatus(commentId, userDate.userId, statusDto.likeStatus);

            const { dislikesCount, likesCount } = this.parsingStatus(currentStatuses, statusDto.likeStatus);
            dislike = dislikesCount;
            like = likesCount;

        } else {

            const newStatus = new StatusLikeDislikeNone(
                userDate.userId,
                userDate.userLogin,
                commentId,
                statusDto.likeStatus);

            const viewStatus = newStatus.viewModel();

            await this.commentsDbRepository.createLikeStatus(viewStatus);

            like = statusDto.likeStatus === statuses.LIKE ? 1 : 0;
            dislike = statusDto.likeStatus === statuses.DISLIKE ? 1 : 0;
        }

        const likesCount = commentResult.likesInfo.likesCount + like;

        const dislikesCount = commentResult.likesInfo.dislikesCount + dislike;

        const updatedComment: Pick<commentEntityViewModel, 'likesCount' | 'dislikesCount'> = {
            likesCount: likesCount >= 0 ? likesCount : 0,
            dislikesCount: dislikesCount >= 0 ? dislikesCount : 0,
        }

        await this.commentsDbRepository.updateComment(commentId, updatedComment);
    }

    async validateCommentAndCheckUser(commentId: string, user: userInterface): Promise<void> {

        validateId(commentId);

        const comment = await this.commentsDbRepository.findCommentById(commentId);

        if (!comment) {
            throw new ThrowError(nameErr['NOT_FOUND']);
        }

        if (user.userId.toString() !== comment.commentatorInfo.userId){
            throw new ThrowError(nameErr['NOT_FORBIDDEN']);
        }
    }

    parsingStatus(currentStatus: string, changedStatus: string): Pick<commentEntityViewModel, 'likesCount' | 'dislikesCount'> {
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