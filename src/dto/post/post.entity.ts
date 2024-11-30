import {ObjectId} from "mongodb";

export class Post {
    createdAt: Date;
    constructor(protected title: string,
                protected shortDescription: string,
                protected content: string,
                protected blogId: ObjectId,
                protected blogName: string) {
        this.createdAt = new Date();
    }


}