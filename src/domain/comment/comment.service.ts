import {validateId} from "../../utils/features/validate/validate.params";
import {CommentsQueryRepository} from "../../repositories/comments/comments.query.repository";
import {CommentsDbRepository} from "../../repositories/comments/comments.db.repository";

export class CommentService {
    constructor(private readonly commentsDbRepository: CommentsDbRepository) {}
    async deleteComment(commentId: string, userId: string){

        validateId(commentId);

        const comment = await this.commentsDbRepository.deleteComment(commentId);
        if (!comment) {
            return;
        }

        if (comment){
            return {
                data: null
            }
        }

        const deleteComment = await this.commentsDbRepository.deleteComment(comment);

        return {
            data: deleteComment
        }
    }
}