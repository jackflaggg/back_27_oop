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
interface transformPostInterface {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date | string;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
        newestLikes: {
            addedAt: Date | string;
            userId: string;
            login: string;
        }[]
    }
}

export const transformPostStatusUsers = (
    valueOne: FlattenMaps<postOutputInterface>,
    valueTwo: FlattenMaps<outputStatusInterface | null>,
    valueThree: FlattenMaps<outputStatusUsersInterface[]>): transformPostInterface => {

    return {
        id: valueOne._id.toString(),
        title: valueOne.title || '',
        shortDescription: valueOne.shortDescription || '',
        content: valueOne.content || '',
        blogId: valueOne.blogId || '',
        blogName: valueOne.blogName || '',
        createdAt: valueOne.createdAt || '',
        extendedLikesInfo: {
            likesCount: valueOne.likesCount || 0,
            dislikesCount: valueOne.dislikesCount || 0,
            myStatus: valueTwo ? valueTwo.status : 'None',
            newestLikes: valueThree ? valueThree.map((item) => ({
                addedAt: item.addedAt || '',
                userId: item.userId || '',
                login: item.login || ''
            }) ) : []
        }
    }
}