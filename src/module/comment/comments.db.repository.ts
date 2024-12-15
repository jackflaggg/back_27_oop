import {CommentModelClass, StatusModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {transformComment, transformCommentToGet} from "../../common/utils/mappers/comment.mapper";
import {
    commentEntityViewModel,
    commentsDbRepoInterface,
    transformCommentInterface, transformCommentToGetInterface
} from "../../models/comment/comment.models";
import {injectable} from "inversify";
import {StatusLikeDislikeNone} from "../like/dto/status.create.dto";
import {likeViewModel} from "../../models/like/like.models";

@injectable()
export class CommentsDbRepository implements commentsDbRepoInterface {
    async createComment(inputComment: commentEntityViewModel): Promise<transformCommentInterface> {
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
    async findCommentById(commentId: string, userId?: ObjectId): Promise<transformCommentToGetInterface | void> {
        const result = await CommentModelClass.findOne({_id: new ObjectId(commentId)});
        if (!result){
            return;
        }
        const status = userId ? await StatusModelClass.findOne({userId, parentId: commentId}) : null;
        return transformCommentToGet(result, status);
    }
    async getCommentStatuses(commentId: string, userId: ObjectId): Promise<any> {
        const filter = {
            $and: [
                {parentId: new ObjectId(commentId)},
                {userId},
            ]
        };
        const result = await StatusModelClass.findOne(filter);

        if (!result){
            return;
        }
        return result
    }
    async updateLikeStatus(commentId: string, userId: ObjectId, status: string): Promise<boolean> {
        const updateResult = await StatusModelClass.updateOne({userId, parentId: new ObjectId(commentId)}, {status});
        return updateResult.matchedCount === 1;
    }
    async createLikeStatus(dtoLike: likeViewModel): Promise<string> {
        const createResult = await StatusModelClass.create(dtoLike);
        return createResult._id.toString()
    }
    async updateComment(commentId: string, dto: Pick<commentEntityViewModel, 'likesCount' | 'dislikesCount'>): Promise<boolean> {
        const updateResult = await CommentModelClass.updateOne({_id: new ObjectId(commentId)}, dto);
        return updateResult.matchedCount === 1;
    }
}