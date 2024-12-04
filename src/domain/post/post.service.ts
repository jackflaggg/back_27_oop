import {PostsDbRepository} from "../../repositories/posts/posts.db.repository";
import {PostCreateDto} from "../../dto/post/post.create.dto";
import {Post} from "../../dto/post/post.entity";
import {ThrowError} from "../../utils/errors/custom.errors";
import {nameErr} from "../../models/common";
import {transformPost} from "../../utils/features/mappers/post.mapper";
import {validateId} from "../../utils/features/validate/validate.params";
import {PostUpdateDto} from "../../dto/post/post.update.dto";
import {CommentCreateDto} from "../../dto/comment/comment.create.dto";
import {Comment} from "../../dto/comment/comment.entity";
import {CommentsDbRepository} from "../../repositories/comments/comments.db.repository";

export class PostService {
    constructor(private postRepository: PostsDbRepository, private commentRepository: CommentsDbRepository) {
    }
    async createPost(postDto: PostCreateDto){
        const checkBlog = await this.validateBlog(postDto.blogId);
        const post = new Post(postDto.title, postDto.shortDescription, postDto.content, checkBlog._id, checkBlog.name as string);

        const date = await this.postRepository.createPost(post);

        return transformPost(date);
    }

    async updatePost(postDto: PostUpdateDto){
        const checkBlog = await this.validateBlog(postDto.blogId);

        return await this.postRepository.updatePost(postDto);

    }

    async deletePost(postId: string){
        return await this.postRepository.deletePost(postId);
    }

    async validateBlog(blogId: string){
        validateId(blogId);

        const existBlog = await this.postRepository.findBlog(blogId);

        if (!existBlog){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'блог не найден', field: '[BlogDbRepository]'}])
        }
        return existBlog;
    }

    async createComment(postId: string, commentDto: CommentCreateDto, userId: any){
        const post = await this.postRepository.findPost(postId);

        if (!post){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'пост не найден', field: '[postRepository]'}])
        }

        const comment = new Comment(commentDto, userId, postId);

        const createComment = await this.commentRepository.CreateComment(comment);

        return await this.commentRepository.findCommentById(createComment[0]._id)
    }
}