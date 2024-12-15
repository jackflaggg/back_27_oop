import {Post} from "../dto/post.entity";
import {transformPostInterface} from "../../../common/utils/mappers/post.mapper";
import {PostUpdateDto} from "../dto/post.update.dto";
import {
    blogMapperInterface,
    postMapper,
    postMapperInterface,
    PostSortInterface
} from "../../../common/utils/features/query.helper";
import {PostCreateDto} from "../dto/post.create.dto";
import {CommentCreateDto} from "../../comment/dto/comment.create.dto";
import {userInterface} from "../../user/models/user.models";
import {transformCommentToGetInterface} from "../../comment/models/comment.models";

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

export interface allPostsInterface {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: postMapperInterface[]
}

export interface postsQueryRepositoryInterface {
    getAllPost: (queryParamsToPost: PostSortInterface) => Promise<allPostsInterface>
    giveOnePost: (id: string) => Promise<transformPostInterface | void>
}