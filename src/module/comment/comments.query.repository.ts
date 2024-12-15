import {transformCommentToGet} from "../../common/utils/mappers/comment.mapper";
import {CommentModelClass, StatusModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {queryHelperToPost, QueryPostModelInterface} from "../../common/utils/features/query.helper";
import {injectable} from "inversify";
import {
    commentsQueryRepoInterface,
    getAllCommentsRepoInterface,
    transformCommentToGetInterface
} from "./models/comment.models";

@injectable()
export class CommentsQueryRepository implements commentsQueryRepoInterface {
    async getComment(idComment: string, userId?: string): Promise<transformCommentToGetInterface | void> {
        const comment = await CommentModelClass.findOne({ _id: new ObjectId(idComment)});

        const user = userId ? await StatusModelClass.findOne({userId: new ObjectId(userId), parentId: new ObjectId(idComment)}) : null;

        if (!comment) {
            return;
        }

        return transformCommentToGet(comment, user);
    }
    async getAllCommentsToPostId(paramsToPostId: string, queryComments: QueryPostModelInterface, userId?: string): Promise<getAllCommentsRepoInterface> {
        const {pageNumber, pageSize, sortBy, sortDirection} = queryHelperToPost(queryComments);

        const skip = (Number(pageNumber) - 1) * Number(pageSize);

        const limit = Number(pageSize);

        const sortOrder = sortDirection === 'asc' ? 1 : -1;

        const pipeline: any[] = [
            { $match: { postId: paramsToPostId } },
            { $sort: { [sortBy]: sortOrder } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'status', // Name of the Status collection
                    let: { commentId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$parentId', '$$commentId'] },
                                        ...(userId ? [{ $eq: ['$userId', new ObjectId(userId)]}] : [])
                                    ],
                                }
                            }
                        },
                        {
                            $project:{
                                _id: 0,
                                status: 1
                            }
                        }
                    ],
                    as: 'status',
                }
            },
            {
                $unwind: {
                    path: '$status',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    'likesInfo.myStatus': {
                        $cond: {
                            if: { $eq: ['$status.status', 'Like'] },
                            then: 'Like',
                            else: {
                                $cond: {
                                    if: { $eq: ['$status.status', 'Dislike'] },
                                    then: 'Dislike',
                                    else: 'None'
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    'status': 0,
                }
            }
        ];

        const comments = await CommentModelClass.aggregate(pipeline)

        const totalCountComments = await CommentModelClass.countDocuments({postId: paramsToPostId});

        const pagesCount = Math.ceil(totalCountComments / Number(pageSize));

        const mapCommented = comments.map(comment =>  transformCommentToGet(comment, comment.status));
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountComments,
            items: mapCommented
        }
    }
}