import {validateId} from "../../common/utils/validators/params.validator";
import {ObjectId} from "mongodb";
import {nameErr} from "../../models/common";
import {CommentCreateDto} from "./dto/comment.create.dto";
import {CommentsDbRepository} from "./comments.db.repository";
import {ThrowError} from "../../common/utils/errors/custom.errors";
import {injectable} from "inversify";
import {userInterface} from "../../models/user/user.models";

@injectable()
export class CommentService {
    constructor(private readonly commentsDbRepository: CommentsDbRepository) {}
    async deleteComment(commentId: string, user: userInterface){

        await this.validateCommentAndCheckUser(commentId, user);

        return await this.commentsDbRepository.deleteComment(commentId);
    }

    async updateComment(commentId: string, contentDto: CommentCreateDto, user: userInterface){
        await this.validateCommentAndCheckUser(commentId, user);
        return await this.commentsDbRepository.updateComment(commentId, contentDto.content);
    }

    async validateCommentAndCheckUser(commentId: string, user: userInterface){

        validateId(commentId);

        const comment = await this.commentsDbRepository.findCommentById(new ObjectId(commentId));
        if (!comment) {
            throw new ThrowError(nameErr['NOT_FOUND']);
        }

        if (String(user.userId) !== comment.commentatorInfo.userId){
            throw new ThrowError(nameErr['NOT_FORBIDDEN']);
        }
    }
}