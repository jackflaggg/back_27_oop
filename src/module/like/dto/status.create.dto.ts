import {ObjectId} from "mongodb";

export class StatusLikeDislikeNone {
    userId: ObjectId;
    userLogin: string
    createdAt: Date;
    parentId: string;
    status: string;

    constructor(userId: ObjectId, userLogin: string, commentId: string, status: string) {
        this.userId = userId;
        this.userLogin = userLogin;
        this.parentId = commentId;
        this.createdAt = new Date();
        this.status = status;
    }

    viewModel(){
        return {
            parentId: this.parentId,
            userId: this.userId,
            userLogin: this.userLogin,
            createdAt: this.createdAt,
            status: this.status
        }
    }
}