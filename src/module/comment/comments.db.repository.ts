import {CommentModelClass, StatusModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {transformComment} from "../../common/utils/mappers/comment.mapper";
import {
    commentEntityViewModel,
    commentsDbRepoInterface,
    transformCommentInterface
} from "../../models/comment/comment.models";
import {injectable} from "inversify";
import {StatusLikeDislikeNone} from "../like/dto/status.create.dto";

@injectable()
export class CommentsDbRepository implements commentsDbRepoInterface {
    async createComment(inputComment: commentEntityViewModel): Promise<any> {
        const result = await CommentModelClass.create(inputComment);
        return transformComment(result);
    }
    async updateContentComment(commentId: string, updateDataComment: string): Promise<boolean> {
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
    async getCommentStatuses(commentId: string, userId: ObjectId): Promise<any> {
        const filter = [{
            $and: [{parentId: new ObjectId(commentId)}, {userId},]
        }];
        const result = await StatusModelClass.findOne(filter);

        if (!result){
            return;
        }
        return result
    }
    async updateLikeStatus(dtoLike: any): Promise<boolean> {
        const updateResult = await StatusModelClass.updateOne({userId: dtoLike.userId, status: dtoLike});
        return updateResult.matchedCount === 1;
    }
    async createLikeStatus(dtoLike: StatusLikeDislikeNone): Promise<string> {
        const createResult = await StatusModelClass.create(dtoLike);
        return createResult._id.toString()
    }

    async updateAllComment(dto: any): Promise<boolean> {
        const updateResult = await CommentModelClass.updateOne({})
        return updateResult.matchedCount === 1;
    }
}