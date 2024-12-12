import {
    blogMapperInterface,
    BlogSortInterface,
    BlogToPostSortInterface, postMapperInterface
} from "../../common/utils/features/query.helper";
import {ObjectId} from "mongodb";

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