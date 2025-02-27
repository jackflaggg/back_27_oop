import "reflect-metadata";
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
import {SETTINGS} from "../../common/config/settings";

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
    async getAllCommentsToPostIdTested(paramsToPostId: string, queryComments: QueryPostModelInterface, userId?: string): Promise<any> {
        const {pageNumber, pageSize, sortBy, sortDirection} = queryHelperToPost(queryComments);

        const skip = (Number(pageNumber) - 1) * Number(pageSize);

        const limit = Number(pageSize);

        const sortOrder = sortDirection === 'asc' ? 1 : -1;
        const pipeline: any[] = [
            {$match: {postId: paramsToPostId}},
            {$sort: {[sortBy]: sortOrder}},
            {$skip: skip},
            {$limit: limit},
            {
                $lookup: {
                    from: SETTINGS.COLLECTION_STATUSES,
                    let: {commentId: '$_id'},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {$eq: ['$parentId', '$$commentId']},
                                        ...(userId ? [{$eq: ['$userId', new ObjectId(userId)]}] : []),
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                status: 1,
                                userId: 1
                            },
                        },
                    ],
                    as: 'status',
                },
            },
            {
                $unwind: {
                    path: '$status',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    'likesInfo.myStatus': {
                        $cond: {
                            if: {$ne: ['$status', null]},
                            then: {
                                $switch: {
                                    branches: [
                                        {
                                            case: {$eq: ['$status.status', 'Like']},
                                            then: 'Like',
                                        },
                                        {
                                            case: {$eq: ['$status.status', 'Dislike']},
                                            then: 'Dislike',
                                        },
                                    ],
                                    default: 'None',
                                }
                            },
                            else: 'None',
                        }
                    },
                },
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

        const mapCommented = comments.map(comment => transformCommentToGet(comment));
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountComments,
            items: mapCommented
        }
    }
}