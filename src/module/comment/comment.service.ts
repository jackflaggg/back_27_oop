import {validateId} from "../../common/utils/validators/params.validator";
import {ObjectId} from "mongodb";
import {nameErr} from "../../models/common";
import {CommentCreateDto} from "./dto/comment.create.dto";
import {ThrowError} from "../../common/utils/errors/custom.errors";
import {inject, injectable} from "inversify";
import {userInterface} from "../../models/user/user.models";
import {commentsDbRepoInterface, commentServiceInterface} from "../../models/comment/comment.models";
import {TYPES} from "../../models/types/types";
import {CommentStatusDto} from "./dto/comment.like-status.dto";

@injectable()
export class CommentService implements commentServiceInterface {
    constructor(@inject(TYPES.CommentsDbRepo) private readonly commentsDbRepository: commentsDbRepoInterface) {}
    async deleteComment(commentId: string, user: userInterface){

        await this.validateCommentAndCheckUser(commentId, user);

        return await this.commentsDbRepository.deleteComment(commentId);
    }

    async updateComment(commentId: string, contentDto: CommentCreateDto, user: userInterface){
        await this.validateCommentAndCheckUser(commentId, user);
        return await this.commentsDbRepository.updateComment(commentId, contentDto.content);
    }

    async updateStatuses(statusDto: CommentStatusDto, commentId: string, userDate: userInterface){
        await this.validateCommentAndCheckUser(commentId, userDate);
        console.log(JSON.stringify(statusDto));
    }

    async validateCommentAndCheckUser(commentId: string, user: userInterface){

        validateId(commentId);

        const comment = await this.commentsDbRepository.findCommentById(new ObjectId(commentId));
        if (!comment) {
            throw new ThrowError(nameErr['NOT_FOUND']);
        }

        if (user.userId.toString() !== comment.commentatorInfo.userId){
            throw new ThrowError(nameErr['NOT_FORBIDDEN']);
        }
    }
}