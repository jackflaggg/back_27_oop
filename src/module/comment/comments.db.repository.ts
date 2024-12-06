import {CommentModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {transformComment} from "../../common/utils/mappers/comment.mapper";
import {
    commentEntityViewModel,
    CommentsDbRepoInterface,
    transformCommentInterface
} from "../../models/comment/comment.models";

export class CommentsDbRepository implements CommentsDbRepoInterface {
    async createComment(inputComment: commentEntityViewModel): Promise<any> {
        return await CommentModelClass.create(inputComment);
    }
    async updateComment(commentId: string, updateDataComment: string): Promise<boolean> {
        const updateComment = await CommentModelClass.updateOne({
                _id: new ObjectId(commentId)},
            {
                $set: { content: updateDataComment}
            })

        return updateComment.matchedCount === 1;
    }
    async deleteComment(id: string): Promise<boolean> {
        const deleteComment = await CommentModelClass.deleteOne({_id: new ObjectId(id)});

        return deleteComment.deletedCount === 1;
    }
    async findCommentById(commentId: ObjectId): Promise<transformCommentInterface | void> {
        const result = await CommentModelClass.findOne({_id: commentId});
        if (!result){
            return;
        }
        return transformComment(result);
    }
}