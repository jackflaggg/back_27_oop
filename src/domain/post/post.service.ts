import {PostsDbRepository} from "../../repositories/posts/posts.db.repository";

export class PostService {
    constructor(private postRepository: PostsDbRepository) {
    }
    createPost(postDto: any){}
    deletePost(postId: string){}
}