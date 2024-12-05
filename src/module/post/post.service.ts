import {nameErr} from "../../models/common";
import {transformPost} from "../../common/utils/mappers/post.mapper";
import {validateId} from "../../common/utils/validators/params.validator";
import {PostCreateDto} from "./dto/post.create.dto";
import {Post} from "./dto/post.entity";
import {PostUpdateDto} from "./dto/post.update.dto";
import {CommentCreateDto} from "../comment/dto/comment.create.dto";
import {Comment} from "../comment/dto/comment.entity";
import {PostsDbRepository} from "./posts.db.repository";
import {CommentsDbRepository} from "../comment/comments.db.repository";
import {ThrowError} from "../../common/utils/errors/custom.errors";

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

    async createComment(postId: string, commentDto: CommentCreateDto, user: any){
        const post = await this.postRepository.findPost(postId);

        if (!post){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'пост не найден', field: '[postRepository]'}])
        }

        const comment = new Comment(commentDto.content, {userId: user.userId, userLogin: user.userLogin}, postId);

        const dateComment = comment.viewModel();
        const createComment = await this.commentRepository.createComment(dateComment);

        return await this.commentRepository.findCommentById(createComment._id)
    }
}