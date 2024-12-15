import {
    blogMapperInterface,
    BlogSortInterface,
    BlogToPostSortInterface, postMapperInterface
} from "../../common/utils/features/query.helper";
import {ObjectId} from "mongodb";
import {Blog} from "../../module/blog/dto/blog.entity";
import {BlogCreateDto} from "../../module/blog/dto/blog.create.dto";

export interface BlogOutInterface {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean
}

export interface BlogsQueryRepositoriesInterface {
    getAllBlog: (queryParamsToBlog: BlogSortInterface) => Promise<getAllBlogInterface>;
    giveOneBlog: (blogId: string) => Promise<BlogOutInterface | void>
    getPostsToBlogID: (paramsToBlogID: ObjectId, queryParamsPosts: BlogToPostSortInterface) => Promise<getPostsToBlogIDInterface>;
}

export interface BlogsDbRepositoryInterface {
    createBlog:         (entity: Blog)              => Promise<blogMapperInterface>
    createPostToBlog:   (entity: any)               => Promise<postMapperInterface>
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