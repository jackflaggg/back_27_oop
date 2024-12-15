import {postViewModel} from "../../blog/models/blog.models";

export class Post {
    createdAt: Date;
    likesCount: number;
    dislikesCount: number
    constructor(protected title: string,
                protected shortDescription: string,
                protected content: string,
                protected blogId: string,
                protected blogName: string) {
        this.createdAt = new Date();
        this.dislikesCount = 0;
        this.likesCount = 0;
    }

    viewModel(): postViewModel{
        return {
            title: this.title,
            shortDescription: this.shortDescription,
            content: this.content,
            blogId: this.blogId,
            blogName: this.blogName,
            createdAt: this.createdAt,
            likesCount: this.likesCount,
            dislikesCount: this.dislikesCount,
        }
    }
}