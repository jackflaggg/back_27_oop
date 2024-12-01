import {CommentModelClass} from "../../db/db";
import {ObjectId} from "mongodb";
import {transformComment} from "../../utils/features/mappers/comment.mapper";

export class CommentsDbRepository {
    async CreateComment(inputComment: any) {
        return await CommentModelClass.insertMany([inputComment]);
    }
    async UpdateComment(commentId: string, updateDataComment: string) {

    }
    async deleteComment(id: string) {

    }
    async findCommentById(commentId: ObjectId) {
        const result = await CommentModelClass.findOne({_id: commentId});
        if (!result){
            return;
        }
        return transformComment(result);
    }
}