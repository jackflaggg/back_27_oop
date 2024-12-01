import {ObjectId} from "mongodb";
import {CommentCreateDto} from "./comment.create.dto";

interface commentatorInfoInterface {
    userId: ObjectId;
    userLogin: string
}
export class Comment {
    createdAt: Date;
    constructor(protected content: CommentCreateDto, protected commentatorInfo: commentatorInfoInterface, protected postId: string) {
        this.createdAt = new Date();
    }
}