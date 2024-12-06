import {FlattenMaps} from "mongoose";
import {ObjectId} from "mongodb";
import {transformCommentInterface} from "../../../models/comment/comment.models";

export function transformComment(value: FlattenMaps<
    {
        content?: string | null | undefined;
        commentatorInfo?: {
            userId?: string | null | undefined,
            userLogin?: string | null | undefined,
        } | null | undefined;
        createdAt?: Date | null | undefined;
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
        postId: value.postId || '',
    }
}