import {CommentatorInfo, CommentDbType} from "../../models/db/db.models";
import {ObjectId, WithId} from "mongodb";
import {FlattenMaps} from "mongoose";

export const commentMapper = (user: WithId<Omit<CommentDbType, 'postId'>>) => ({
        id: user._id.toString(),
        content: user.content,
        commentatorInfo: {
            userId: user.commentatorInfo.userId,
            userLogin: user.commentatorInfo.userLogin,
        },
        createdAt: user.createdAt,
})

export function transformComment(value: FlattenMaps<
    {
        content?: string | null | undefined;
        commentatorInfo?: {
            userId?: string | null | undefined,
            userLogin?: string | null | undefined,
        } | null | undefined;
        createdAt?: string | null | undefined;
        postId?: string | null | undefined;
        _id: ObjectId}>) {
    return {
        id: String(value._id),
        content: value.content || '',
        commentatorInfo: value.commentatorInfo || '',
        createdAt: value.createdAt || '',
        postId: value.postId || '',
    }
}