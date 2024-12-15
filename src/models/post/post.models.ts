import {Post} from "../../module/post/dto/post.entity";
import {transformPostInterface} from "../../common/utils/mappers/post.mapper";
import {PostUpdateDto} from "../../module/post/dto/post.update.dto";
import {blogMapperInterface, postMapperInterface} from "../../common/utils/features/query.helper";
import {PostCreateDto} from "../../module/post/dto/post.create.dto";
import {CommentCreateDto} from "../../module/comment/dto/comment.create.dto";
import {userInterface} from "../user/user.models";
import {transformCommentToGetInterface} from "../comment/comment.models";

export interface postDbRepositoryInterface {
    createPost: (entity: Post) => Promise<transformPostInterface>
    updatePost: (postDto: PostUpdateDto) => Promise<boolean>
    deletePost: (postId: string) => Promise<boolean>
    findBlog: (blogId: string) => Promise<blogMapperInterface | void>
    findPost: (postId: string) => Promise<postMapperInterface | void>
}

export interface postServiceInterface {
    createPost: (postDto: PostCreateDto) => Promise<transformPostInterface>
    updatePost: (postDto: PostUpdateDto) => Promise<boolean>
    deletePost: (postId: string) => Promise<boolean>
    validateBlog: (blogId: string) => Promise<blogMapperInterface>
    createComment: (postId: string, commentDto: CommentCreateDto, user: userInterface) => Promise<transformCommentToGetInterface | void>
}