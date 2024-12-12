import {ObjectId} from "mongodb";

export class Post {
    createdAt: Date;
    constructor(protected title: string,
                protected shortDescription: string,
                protected content: string,
                protected blogId: string,
                protected blogName: string) {
        this.createdAt = new Date();
    }

    viewModel(){
        return {
            title: this.title,
            shortDescription: this.shortDescription,
            content: this.content,
            blogId: this.blogId,
            blogName: this.blogName,
            createdAt: this.createdAt,
        }
    }
}