import {CommentModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {transformComment} from "../../common/utils/mappers/comment.mapper";

export class CommentsDbRepository {
    async createComment(inputComment: any) {
        return await CommentModelClass.create(inputComment);
    }
    async updateComment(commentId: string, updateDataComment: string) {
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