import {
    blogMapperInterface,
    BlogSortInterface,
    BlogToPostSortInterface, postMapperInterface, PostSortInterface
} from "../../../common/utils/features/query.helper";
import {ObjectId} from "mongodb";
import {Blog} from "../dto/blog.entity";
import {BlogCreateDto} from "../dto/blog.create.dto";

export interface BlogOutInterface {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean
}

export interface postViewModel {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date,
    likesCount: number,
    dislikesCount: number,
}

export interface BlogsQueryRepositoriesInterface {
    getAllBlog: (queryParamsToBlog: BlogSortInterface) => Promise<getAllBlogInterface>;
    giveOneBlog: (blogId: string) => Promise<BlogOutInterface>
    getAllPostToBlog: (queryParamsToPost: PostSortInterface, userId?: string | null, blogId?: string) => Promise<any/*allPostsInterface*/>
}

export interface BlogsDbRepositoryInterface {
    createBlog:         (entity: Blog)              => Promise<blogMapperInterface>
    createPostToBlog:   (entity: postViewModel)     => Promise<any/*postMapperInterface*/>
    findBlogById:       (blogId: string)            => Promise<blogMapperInterface | void>
    findPost:           (postId: string)            => Promise<postMapperInterface | void>
    updateBlog:         (blogDto: BlogCreateDto)    => Promise<boolean>
    deleteBlog:         (blogId: string)            => Promise<boolean>
}

export interface getAllBlogInterface {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: blogMapperInterface[] | void[]
}

export interface getPostsToBlogIDInterface {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: postMapperInterface[] | void[]
}