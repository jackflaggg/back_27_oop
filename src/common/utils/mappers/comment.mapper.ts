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
        _id: ObjectId}> | null | undefined): any/*transformCommentInterface*/ {
    return {
        id: String(valueOne._id),
        content: valueOne.content || '',
        commentatorInfo: {
            userId: valueOne.commentatorInfo?.userId || valueTwo?.userId,
            userLogin: valueOne.commentatorInfo?.userLogin || valueTwo?.userLogin,
        },
        createdAt: valueOne.createdAt || '',
        likesInfo: {
            likesCount: valueOne.likesCount || 0,
            dislikesCount: valueOne.dislikesCount || 0,
            myStatus: valueTwo?.status || 'None'
        }
    }
}