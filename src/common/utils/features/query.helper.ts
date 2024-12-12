import {ObjectId, SortDirection} from "mongodb";
import {FlattenMaps} from 'mongoose'

export interface QueryBlogInputInterface {
    searchNameTerm?: string | null,
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: number,
    pageSize?: number,
}

export interface QueryBlogInputInterfaceToPost {
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: number,
    pageSize?: number,
}

export interface BlogSortInterface {
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number,
    pageSize: number,
}

export interface BlogToPostSortInterface {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirection,
}

export interface QueryPostModelInterface {
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: number,
    pageSize?: number,
}

export interface FlattenedBlogsInterface {
    createdAt?: Date | null | undefined;
    name?: string | null | undefined;
    description?: string | null | undefined;
    websiteUrl?: string | null | undefined;
    isMembership?: boolean | null | undefined;
    _id: ObjectId
}

export interface blogMapperInterface {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}

export const queryHelperToPost = (queryPost: QueryPostModelInterface): PostSortInterface => ({
    pageNumber: queryPost.pageNumber ?? 1,
    pageSize: queryPost.pageSize ?? 10,
    sortBy: queryPost.sortBy ?? 'createdAt',
    sortDirection: queryPost.sortDirection ?? 'desc',
});

export const queryHelper = (view: QueryBlogInputInterface): BlogSortInterface => ({
    searchNameTerm: view.searchNameTerm ?? null,
    sortBy: view.sortBy ?? 'createdAt',
    sortDirection: view.sortDirection ?? 'desc',
    pageNumber: view.pageNumber ?? 1,
    pageSize: view.pageSize ?? 10,
});

export const getBlogsQueryToPost = (view: QueryBlogInputInterfaceToPost):  BlogToPostSortInterface => ({
    pageNumber: view.pageNumber ?? 1,
    pageSize: view.pageSize ?? 10,
    sortBy: view.sortBy ?? 'createdAt',
    sortDirection: view.sortDirection ?? 'desc',
});

export const blogMapper = (blog: FlattenMaps<FlattenedBlogsInterface>): blogMapperInterface => ({
    id: String(blog._id),
    name: blog.name || '',
    description: blog.description || '',
    websiteUrl: blog.websiteUrl || '',
    createdAt: blog.createdAt?.toISOString() || '',
    isMembership: blog.isMembership || false,
})

/*--------------------------------------------------------------------------------------------------------------------*/

export interface PostSortInterface {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: SortDirection,
}

export interface QueryPostInputInterface {
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: SortDirection,
}

export interface FlattenedPostsInterface {
    title?: string | null | undefined;
    shortDescription?: string | null | undefined;
    content?: string | null | undefined;
    blogId?: string | null | undefined;
    blogName?: string | null | undefined;
    createdAt?: Date | null | undefined;
    _id: ObjectId
}

export const getPostsQuery = (queryPost: QueryPostInputInterface): PostSortInterface => ({
    pageNumber: queryPost.pageNumber ?? 1,
    pageSize: queryPost.pageSize ?? 10,
    sortBy: queryPost.sortBy ?? 'createdAt',
    sortDirection: queryPost.sortDirection ?? 'desc',
});

export interface postMapperInterface {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string | ObjectId,
    blogName: string,
    createdAt: string,
}
export const postMapper = (post: FlattenMaps<FlattenedPostsInterface>): postMapperInterface => ({
    id: String(post._id),
    title: post.title || '',
    shortDescription: post.shortDescription || '',
    content: post.content || '',
    blogId: post.blogId || '',
    blogName: post.blogName || '',
    createdAt: post.createdAt?.toISOString() || '',
})

/*--------------------------------------------------------------------------------------------------------------------*/

export interface QueryUsers {
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: number,
    pageSize?: number,
    searchLoginTerm?: string | null,
    searchEmailTerm?: string | null,
}

export interface QueryUsersOutputInterface {
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
}

export const queryHelperToUser = (queryUser: QueryUsers): QueryUsersOutputInterface => ({
    sortBy: queryUser.sortBy ?? 'createdAt',
    sortDirection: queryUser.sortDirection ?? 'desc',
    pageNumber: queryUser.pageNumber ?? 1,
    pageSize: queryUser.pageSize ?? 10,
    searchLoginTerm: queryUser.searchLoginTerm ?? null,
    searchEmailTerm: queryUser.searchEmailTerm ?? null,
});