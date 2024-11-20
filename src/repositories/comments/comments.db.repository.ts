import {ObjectId} from "mongodb";
import {CommentDbType} from "../../models/db/db.models";
import {CommentModelClass} from "../../db/db";

export const CommentsDbRepository = {
    async CreateComment(inputComment: CommentDbType): Promise<string> {

        const comment = await CommentModelClass.insertMany(inputComment);

        return comment[0]._id.toString();
    },
    async UpdateComment(commentId: string, updateDataComment: string): Promise<boolean> {
        const updateComment = await CommentModelClass.updateOne({_id: new ObjectId(commentId)}, {$set: { content: updateDataComment} })

        return updateComment.matchedCount === 1;
    },
    async deleteComment(id: string): Promise<boolean> {
        const deleteComment = await CommentModelClass.deleteOne({_id: new ObjectId(id)});

        return deleteComment.deletedCount === 1;
    },
}