import {ObjectId} from "mongodb";
import {commentEntityViewModel} from "../../../models/comment/comment.models";

interface commentatorInfoInterface {
    userId: ObjectId;
    userLogin: string
}
export class Comment {
    createdAt: Date;
    content: string;
    commentatorInfo: commentatorInfoInterface;
    postId: string;

    constructor( content: string, commentatorInfo: commentatorInfoInterface, postId: string) {
        this.content = content;
        this.createdAt = new Date();
        this.postId = postId;
        this.commentatorInfo = commentatorInfo;
    }

    viewModel(): commentEntityViewModel{
        return {
            content: this.content,
            commentatorInfo: {
                userId: this.commentatorInfo.userId,
                userLogin: this.commentatorInfo.userLogin,
            },
            createdAt: this.createdAt,
            postId: this.postId
        }
    }
}