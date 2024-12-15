import {ObjectId} from "mongodb";

export const statuses = {
    'LIKE': 'Like',
    'NONE': 'None',
    'DISLIKE': 'Dislike'
}

export interface likeViewModel {
    userId: ObjectId;
    userLogin: string
    createdAt: Date;
    parentId: string;
    status: string;
}