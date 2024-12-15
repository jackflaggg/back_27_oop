import {transformCommentToGet} from "../../common/utils/mappers/comment.mapper";
import {CommentModelClass, StatusModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {queryHelperToPost, QueryPostModelInterface} from "../../common/utils/features/query.helper";
import {injectable} from "inversify";
import {
    commentsQueryRepoInterface,
    getAllCommentsRepoInterface,
    transformCommentInterface
} from "../../models/comment/comment.models";

@injectable()
export class CommentsQueryRepository implements commentsQueryRepoInterface {
    async getComment(idComment: string, userId?: string): Promise<transformCommentInterface | void> {
        const comment = await CommentModelClass.findOne({ _id: new ObjectId(idComment)});

        const user = userId ? await StatusModelClass.findOne({userId: new ObjectId(userId), parentId: new ObjectId(idComment)}) : null;

        if (!comment) {
            return;
        }

        return transformCommentToGet(comment, user);
    }
    async getAllCommentsToPostId(paramsToPostId: string, queryComments: QueryPostModelInterface, userId?: string): Promise<getAllCommentsRepoInterface> {
        const {pageNumber, pageSize, sortBy, sortDirection} = queryHelperToPost(queryComments);

        const comments = await CommentModelClass
            .find({postId: paramsToPostId})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((Number(pageNumber) - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .lean();

        const totalCountComments = await CommentModelClass.countDocuments({postId: paramsToPostId});

        const pagesCount = Math.ceil(totalCountComments / Number(pageSize));

        const userPromises = comments.map(async comment => {
            const status = userId ? await StatusModelClass.findOne({userId: new ObjectId(userId), parentId: new ObjectId(comment._id)}) : null;
            return transformCommentToGet(comment, status);
        })

        const mapCommented = await Promise.all(userPromises);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountComments,
            items: mapCommented
        }
    }
}