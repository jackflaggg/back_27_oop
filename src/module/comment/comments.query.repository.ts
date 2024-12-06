import {transformComment} from "../../common/utils/mappers/comment.mapper";
import {CommentModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {queryHelperToPost, QueryPostModelInterface} from "../../common/utils/features/query.helper";
import {injectable} from "inversify";

interface CommentsQueryRepoInterface {
    getComment: (id: string) => Promise<any>;
    getAllCommentsToPostId: (param: string, query: QueryPostModelInterface) => Promise<any>;
}

@injectable()
export class CommentsQueryRepository implements CommentsQueryRepoInterface{
    async getComment(idComment: string) {
        const comment = await CommentModelClass.findOne({ _id: new ObjectId(idComment)});

        if (!comment) {
            return;
        }

        return transformComment(comment);
    }
    async getAllCommentsToPostId(paramsToPostId: string, queryComments: QueryPostModelInterface) {
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
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountComments,
            items: comments.map(comments => transformComment(comments))
        }
    }
}