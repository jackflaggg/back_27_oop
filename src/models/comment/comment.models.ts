import {QueryPostModelInterface} from "../../common/utils/features/query.helper";
import {ObjectId} from "mongodb";
import {userInterface} from "../user/user.models";
import {CommentCreateDto} from "../../module/comment/dto/comment.create.dto";
import {NextFunction, Request, Response} from "express";
import {CommentStatusDto} from "../../module/comment/dto/comment.like-status.dto";
import {likeViewModel} from "../like/like.models";

export interface commentsQueryRepoInterface {
    getComment:             (id: string, userId?: string)                                       => Promise<transformCommentToGetInterface | void>;
    getAllCommentsToPostId: (param: string, query: QueryPostModelInterface, userId?: string)    => Promise<getAllCommentsRepoInterface>;
}

export interface transformCommentInterface {
    id:             string,
    content:        string,
    commentatorInfo: {
        userId:     string,
        userLogin:  string,
    },
    createdAt:      string | Date,
    likesCount:     number,
    dislikesCount:  number,
}

export interface transformCommentToGetInterface {
    id:                 string,
    content:            string,
    commentatorInfo: {
        userId:         string,
        userLogin:      string,
    },
    createdAt:          string | Date,
    likesInfo: {
        likesCount:     number,
        dislikesCount:  number,
        myStatus:       string
    }
}

export interface getAllCommentsRepoInterface {
    pagesCount: number,
    page:       number,
    pageSize:   number,
    totalCount: number,
    items:      transformCommentToGetInterface[]
}

export interface commentsDbRepoInterface {
    createComment:          (inputComment: commentEntityViewModel)                                                  => Promise<transformCommentInterface>;
    updateContentComment:   (commentId: string, updateDataComment: string)                                          => Promise<boolean>;
    deleteComment:          (id: string)                                                                            => Promise<boolean>;
    findCommentById:        (commentId: string, userId?: ObjectId)                                                  => Promise<transformCommentToGetInterface | void>;
    getCommentStatuses:     (commentId: string, userId: ObjectId)                                                   => Promise<any>
    updateLikeStatus:       (commentId: string, userId: ObjectId, status: string)                                   => Promise<any>
    createLikeStatus:       (dtoLike: likeViewModel)                                                                => Promise<string>
    updateComment:          (commentId: string, dto: Pick<commentEntityViewModel, 'likesCount' | 'dislikesCount'>)  => Promise<boolean>
}

export interface commentEntityViewModel {
    content:        string,
    commentatorInfo: {
        userId:     ObjectId,
        userLogin:  string,
    },
    createdAt:      Date,
    postId:         string,
    likesCount:     number,
    dislikesCount:  number,
}

export interface commentServiceInterface {
    deleteComment:                  (commentId: string, user: userInterface)                                    => Promise<boolean>;
    updateComment:                  (commentId: string, contentDto: CommentCreateDto, user: userInterface)      => Promise<boolean>;
    validateCommentAndCheckUser:    (commentId: string, user: userInterface)                                    => Promise<void>
    updateStatuses:                 (statusDto: CommentStatusDto, commentId: string, userDate: userInterface)   => Promise<any>
    parsingStatus:                  (currentStatus: string, changedStatus: string)                              => Pick<commentEntityViewModel, 'likesCount' | 'dislikesCount'>
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
