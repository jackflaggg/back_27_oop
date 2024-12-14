import {FlattenMaps} from "mongoose";
import {ObjectId} from "mongodb";

export function transformComment(value: FlattenMaps<
    {
        content?: string | null | undefined;
        commentatorInfo?: {
            userId?: string | null | undefined,
            userLogin?: string | null | undefined,
        } | null | undefined;
        createdAt?: Date | null | undefined;
        likesInfo?: {
            likesCount?: number | null | undefined,
            dislikesCount?: number | null | undefined,
            myStatus?: string | null | undefined,
        } | null | undefined;
        postId?: string | null | undefined;
        _id: ObjectId}>): any/*transformCommentInterface*/ {
    return {
        id: String(value._id),
        content: value.content || '',
        commentatorInfo: {
            userId: value.commentatorInfo?.userId || '',
            userLogin: value.commentatorInfo?.userLogin || '',
        },
        createdAt: value.createdAt || '',
        likesInfo: {
            likesCount: value.likesInfo?.likesCount,
            dislikesCount: value.likesInfo?.dislikesCount,
            myStatus: value.likesInfo?.myStatus
        }
    }
}

export function transformCommentToGet(value: FlattenMaps<
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
        _id: ObjectId}>): any/*transformCommentInterface*/ {
    return {
        id: String(value._id),
        content: value.content || '',
        commentatorInfo: {
            userId: value.commentatorInfo?.userId || '',
            userLogin: value.commentatorInfo?.userLogin || '',
        },
        createdAt: value.createdAt || '',
        likesInfo: {
            likesCount: value.likesCount || 0,
            dislikesCount: value.dislikesCount || 0,
            myStatus: 'None'
        }
    }
}