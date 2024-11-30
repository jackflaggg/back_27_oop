import {PostsDbRepository} from "../../repositories/posts/posts.db.repository";
import {PostCreateDto} from "../../dto/post/post.create.dto";
import {Post} from "../../dto/post/post.entity";
import {ThrowError} from "../../utils/errors/custom.errors";
import {nameErr} from "../../models/common";

export class PostService {
    constructor(private postRepository: PostsDbRepository) {
    }
    async createPost(postDto: PostCreateDto){
        const existBlog = await this.postRepository.findBlog(postDto.blogId);
        if (!existBlog){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'блог не найден', field: '[BlogDbRepository]'}])
        }
        const post = new Post(postDto.title, postDto.shortDescription, postDto.content, existBlog._id, existBlog.name as string);
        return await this.postRepository.createPost(post)
    }
    async deletePost(postId: string){}
}