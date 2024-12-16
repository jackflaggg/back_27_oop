import {FlattenMaps} from "mongoose";
import {outputStatusInterface, outputStatusUsersInterface} from "../../like/features/status.mapper";
import {ObjectId} from "mongodb";

export interface postOutputInterface {
    _id: ObjectId
    likesCount?: number | null | undefined
    dislikesCount?: number | null | undefined
    title?: string | null | undefined
    shortDescription?: string | null | undefined
    content?: string | null | undefined
    blogId?: string | null | undefined
    blogName?: string | null | undefined
    createdAt?: Date | null | undefined
}

export const transformPostStatusUsers = (
    valueOne: FlattenMaps<postOutputInterface>,
    valueTwo: FlattenMaps<outputStatusInterface | null>,
    valueThree: FlattenMaps<outputStatusUsersInterface[] | void[]>) => {
    return {
        id: valueOne._id.toString(),
        title: valueOne.title || '',
        shortDescription: valueOne.shortDescription || '',
        content: valueOne.content || '',
        blogId: valueOne.blogId || '',
        blogName: valueOne.blogName || '',
        createdAt: valueOne.createdAt || '',
        extendedLikesInfo: {
            likesCount: valueOne.likesCount || '',
            dislikesCount: valueOne.dislikesCount || '',
            myStatus: valueTwo ? valueTwo.status : 'None',
            newestLikes: valueThree[0] ? [
                {
                    addedAt: valueThree[0].addedAt || '',
                    userId: valueThree[0].userId || '',
                    login: valueThree[0].login || ''
                }
            ] : []
        }
    }
}