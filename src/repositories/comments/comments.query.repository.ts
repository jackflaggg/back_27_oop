import {transformComment} from "../../utils/features/mappers/comment.mapper";
import {CommentModelClass} from "../../db/db";
import {ObjectId} from "mongodb";

export class CommentsQueryRepository {
    async getComment(idComment: string) {
        const comment = await CommentModelClass.findOne({ _id: new ObjectId(idComment)});

        if (!comment) {
            return;
        }

        return transformComment(comment);
    }
    async getAllCommentsToPostId(paramsToPostId: string, queryComments: any) {

    }
}