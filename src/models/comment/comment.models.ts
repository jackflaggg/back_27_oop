import {QueryPostModelInterface} from "../../common/utils/features/query.helper";
import {CommentsDbRepository} from "../../module/comment/comments.db.repository";
import {ObjectId} from "mongodb";

export interface CommentsQueryRepoInterface {
    getComment: (id: string) => Promise<transformCommentInterface | void>;
    getAllCommentsToPostId: (param: string, query: QueryPostModelInterface) => Promise<getAllCommentsRepoInterface>;
}

export interface transformCommentInterface {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string,
    },
    createdAt: string | Date,
    postId: string,
}

export interface getAllCommentsRepoInterface {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: transformCommentInterface[]
}

export interface CommentsDbRepoInterface {
    createComment: (inputComment: commentEntityViewModel) => Promise<any>;
    updateComment: (commentId: string, updateDataComment: string) => Promise<boolean>;
    deleteComment: (id: string) => Promise<boolean>;
    findCommentById: (commentId: ObjectId) => Promise<transformCommentInterface | void>;
}

export interface commentEntityViewModel {
    content: string,
    commentatorInfo: {
        userId: ObjectId,
        userLogin: string,
    },
    createdAt: Date,
    postId: string
}