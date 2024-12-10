import {QueryPostModelInterface} from "../../common/utils/features/query.helper";
import {ObjectId} from "mongodb";
import {userInterface} from "../user/user.models";
import {CommentCreateDto} from "../../module/comment/dto/comment.create.dto";
import {NextFunction, Request, Response} from "express";
import {CommentStatusDto} from "../../module/comment/dto/comment.like-status.dto";

export interface commentsQueryRepoInterface {
    getComment: (id: string) => Promise<transformCommentInterface | void>;
    getAllCommentsToPostId: (param: string, query: QueryPostModelInterface) => Promise<getAllCommentsRepoInterface>;
}

export interface likesInfo {
    likesCount: number,
    dislikesCount: number,
    myStatus: typeof commentStatus,
}
export interface transformCommentInterface {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string,
    },
    createdAt: string | Date,
    //postId: string,
}

export interface getAllCommentsRepoInterface {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: transformCommentInterface[]
}

export interface commentsDbRepoInterface {
    createComment: (inputComment: commentEntityViewModel) => Promise<any>;
    updateComment: (commentId: string, updateDataComment: string) => Promise<boolean>;
    deleteComment: (id: string) => Promise<boolean>;
    findCommentById: (commentId: ObjectId) => Promise<transformCommentInterface | void>;
    getCommentStatuses: (commentId: string, userId: ObjectId) => Promise<any>
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

export interface commentServiceInterface {
    deleteComment: (commentId: string, user: userInterface) => Promise<boolean>;
    updateComment: (commentId: string, contentDto: CommentCreateDto, user: userInterface) => Promise<boolean>;
    validateCommentAndCheckUser: (commentId: string, user: userInterface) => Promise<void>
    updateStatuses: (statusDto: CommentStatusDto, commentId: string, userDate: userInterface) => Promise<any>
}

export interface commentRouterInterface {
    getOneComment: (req: Request, res: Response, next: NextFunction) => Promise<void>
    updateComment: (req: Request, res: Response, next: NextFunction) => Promise<void>
    deleteComment: (req: Request, res: Response, next: NextFunction) => Promise<void>
    likeStatus:    (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export const commentStatus = {
    NONE: 'None',
    LIKE: 'Like',
    DISLIKE: 'Dislike'
};
