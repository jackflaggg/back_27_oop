import {CommentModelClass} from "../../db/db";
import {ObjectId} from "mongodb";
import {transformComment} from "../../utils/features/mappers/comment.mapper";

export class CommentsDbRepository {
    async CreateComment(inputComment: any) {
        return await CommentModelClass.create(inputComment);
    }
    async UpdateComment(commentId: string, updateDataComment: string) {
        const updateComment = await CommentModelClass.updateOne({
                _id: new ObjectId(commentId)},
            {
                $set: { content: updateDataComment}
            })

        return updateComment.matchedCount === 1;
    }
    async deleteComment(id: string) {
        const deleteComment = await CommentModelClass.deleteOne({_id: new ObjectId(id)});

        return deleteComment.deletedCount === 1;
    }
    async findCommentById(commentId: ObjectId) {
        const result = await CommentModelClass.findOne({_id: commentId});
        if (!result){
            return;
        }
        return transformComment(result);
    }
}