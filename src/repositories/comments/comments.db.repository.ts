import {ObjectId} from "mongodb";
import {CommentDbType} from "../../models/db/db.models";
import {CommentModelClass} from "../../db/db";

export const CommentsDbRepository = {
    async CreateComment(inputComment: CommentDbType) {

        const comment = await CommentModelClass.insertMany(inputComment);

        return comment[0]._id.toString();
    },
    async UpdateComment(commentId: string, updateDataComment: string): Promise<string | null> {
        const updateComment = await CommentModelClass.updateOne({_id: new ObjectId(commentId)}, {$set: { content: updateDataComment} })

        const { acknowledged, modifiedCount} = updateComment;

        return acknowledged && Boolean(modifiedCount);
    },
    async deleteComment(id: string): Promise<boolean> {
        const deleteComment = await CommentModelClass.deleteOne({_id: new ObjectId(id)});

        return deleteComment.acknowledged;
    },
}