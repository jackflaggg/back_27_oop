import {transformComment} from "../../utils/features/mappers/comment.mapper";
import {CommentModelClass} from "../../db/db";
import {ObjectId} from "mongodb";
import {queryHelperToPost} from "../../utils/features/query/query.helper";

export class CommentsQueryRepository {
    async getComment(idComment: string) {
        const comment = await CommentModelClass.findOne({ _id: new ObjectId(idComment)});

        if (!comment) {
            return;
        }

        return transformComment(comment);
    }
    async getAllCommentsToPostId(paramsToPostId: string, queryComments: any) {
        const {pageNumber, pageSize, sortBy, sortDirection} = queryHelperToPost(queryComments);

        const comments = await CommentModelClass
            .find({postId: paramsToPostId})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((Number(pageNumber) - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .lean();

        const totalCountComments = await CommentModelClass.countDocuments({postId: paramsToPostId});

        const pagesCount = Math.ceil(totalCountComments / Number(pageSize));

        return {
            pagesCount: +pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCountComments,
            items: comments.map(comments => transformComment(comments))
        }
    }
}