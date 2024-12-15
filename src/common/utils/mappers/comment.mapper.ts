import {FlattenMaps} from "mongoose";
import {ObjectId} from "mongodb";
import {transformCommentInterface, transformCommentToGetInterface} from "../../../module/comment/models/comment.models";

export function transformComment(value: FlattenMaps<
    {
        content?: string | null | undefined;
        commentatorInfo?: {
            userId?: string | null | undefined,
            userLogin?: string | null | undefined,
        } | null | undefined;
        createdAt?: Date | null | undefined;
        likesCount?: number | null | undefined,
        dislikesCount?: number | null | undefined,
        postId?: string | null | undefined;
        _id: ObjectId}>): transformCommentInterface {
    return {
        id: String(value._id),
        content: value.content || '',
        commentatorInfo: {
            userId: value.commentatorInfo?.userId || '',
            userLogin: value.commentatorInfo?.userLogin || '',
        },
        createdAt: value.createdAt || '',
        likesCount: value.likesCount || 0,
        dislikesCount: value.dislikesCount || 0,
    }
}

export function transformCommentToGet(valueOne: FlattenMaps<{
    content?: string | null | undefined;
    commentatorInfo?: {
        userId?: string | null | undefined,
        userLogin?: string | null | undefined,
    } | null | undefined;
    createdAt?: Date | null | undefined;
    likesCount?: number | null | undefined,
    dislikesCount?: number | null | undefined,
    postId?: string | null | undefined;
    _id: ObjectId}>, valueTwo?: FlattenMaps<{
    userId?: string | null | undefined;
    userLogin?: string | null | undefined;
    parentId?: string | null | undefined;
    status?: string | null | undefined;
    createdAt?: Date | null | undefined;
    _id: ObjectId}> | null | undefined): transformCommentToGetInterface {
    return {
        id: String(valueOne._id),
        content: valueOne.content || '',
        commentatorInfo: {
            userId: valueOne.commentatorInfo?.userId || valueTwo?.userId || '',
            userLogin: valueOne.commentatorInfo?.userLogin || valueTwo?.userLogin || '',
        },
        createdAt: valueOne.createdAt || '',
        likesInfo: {
            likesCount: valueOne.likesCount || 0,
            dislikesCount: valueOne.dislikesCount || 0,
            myStatus: valueTwo?.status || 'None'
        }
    }
}

interface CommentType {
    _id: ObjectId;
    content?: string | null;
    commentatorInfo?: {
        userId?: string | null;
        userLogin?: string | null;
    } | null;
    createdAt?: Date | null;
    likesCount?: number
    dislikesCount?: number
    likesInfo?: {
        myStatus?: string | null;
    };
}

interface transformCommentNewToGetInterface {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: Date | string;
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string//'Like' | 'Dislike' | 'None';
    };
}

export function transformCommentToGetAll(valueOne: FlattenMaps<CommentType>): transformCommentNewToGetInterface {
    return {
        id: String(valueOne._id),
        content: valueOne.content || '',
        commentatorInfo: {
            userId: valueOne.commentatorInfo?.userId || '',
            userLogin: valueOne.commentatorInfo?.userLogin || '',
        },
        createdAt: valueOne.createdAt || '',
        likesInfo: {
            likesCount: valueOne.likesCount || 0,
            dislikesCount: valueOne.dislikesCount || 0,
            myStatus: valueOne?.likesInfo?.myStatus || ''
        }
    }
}