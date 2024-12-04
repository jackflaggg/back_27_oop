import {validateId} from "../../utils/features/validate/validate.params";
import {CommentsDbRepository} from "../../repositories/comments/comments.db.repository";
import {ObjectId} from "mongodb";
import {ThrowError} from "../../utils/errors/custom.errors";
import {nameErr} from "../../models/common";

export class CommentService {
    constructor(private readonly commentsDbRepository: CommentsDbRepository) {}
    async deleteComment(commentId: string, user: any){

        validateId(commentId);

        const comment = await this.commentsDbRepository.findCommentById(new ObjectId(commentId));
        if (!comment) {
            throw new ThrowError(nameErr['NOT_FOUND']);
        }

        if (user.userId !== comment.commentatorInfo.userId){
            throw new ThrowError(nameErr['NOT_FORBIDDEN']);
        }

        return await this.commentsDbRepository.deleteComment(comment.id);
    }
}