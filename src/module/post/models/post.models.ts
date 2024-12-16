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
import {ObjectId} from "mongodb";
import {likeViewModel} from "../../like/models/like.models";

export interface postDbRepositoryInterface {
    createPost: (entity: Post) => Promise<transformPostInterface>
    updatePost: (postDto: PostUpdateDto) => Promise<boolean>
    deletePost: (postId: string) => Promise<boolean>
    findBlog: (blogId: string) => Promise<blogMapperInterface | void>
    findPost: (postId: string) => Promise<postMapperInterface | void>
    updateLikeStatus: (postId: string, userId: ObjectId, status: string) => Promise<boolean>
    createLikeStatus: (dtoLike: likeViewModel) => Promise<string>
    getStatusPost: (postId: string, userId: ObjectId/*, status: string*/) => Promise<string | void>
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
    items: /*postMapperInterface*/any[]
}

export interface postsQueryRepositoryInterface {
    getAllPost: (queryParamsToPost: PostSortInterface, userId?: string | null, blogId?: string) => Promise<any/*allPostsInterface*/>
    giveOnePost: (id: string, userId?: string) => Promise<transformPostInterface | void>
    getLikeStatus: (userId: string, postId: string) => Promise<any>
    getLatestThreeLikes: (postId: string, userId: string) => Promise<any>
}