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
import {userInterface} from "../../models/user/user.models";
import {inject, injectable} from "inversify";
import {TYPES} from "../../models/types/types";

@injectable()
export class PostService {
    constructor(@inject(TYPES.PostsDbRepo) private postRepository: PostsDbRepository,
                @inject(TYPES.CommentsDbRepo) private commentRepository: CommentsDbRepository) {
    }
    async createPost(postDto: PostCreateDto){
        const checkBlog = await this.validateBlog(postDto.blogId);
        const post = new Post(postDto.title, postDto.shortDescription, postDto.content, checkBlog._id.toString(), checkBlog.name as string);

        const date = await this.postRepository.createPost(post);

        return transformPost(date);
    }

    async updatePost(postDto: PostUpdateDto){
        const checkBlog = await this.validateBlog(postDto.blogId);

        return await this.postRepository.updatePost(postDto);

    }

    async deletePost(postId: string): Promise<boolean>{
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

    async createComment(postId: string, commentDto: CommentCreateDto, user: userInterface){
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