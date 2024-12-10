import {FlattenMaps} from "mongoose";
import {ObjectId} from "mongodb";
import {commentStatus, likesInfo, transformCommentInterface} from "../../../models/comment/comment.models";

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
        //postId: value.postId || '',
        likesInfo: {
            likesCount: value.likesInfo?.likesCount || 0,
            dislikesCount: value.likesInfo?.dislikesCount || 0,
            myStatus: 'None'
        }
    }
}