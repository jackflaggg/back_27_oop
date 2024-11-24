import {ObjectId, SortDirection} from "mongodb";
import {FlattenMaps} from 'mongoose'

export interface QueryBlogInputInterface {
    searchNameTerm?: string | null,
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

export interface FlattenedBlogsInterface {
    createdAt?: Date | null | undefined;
    name?: string | null | undefined;
    description?: string | null | undefined;
    websiteUrl?: string | null | undefined;
    isMembership?: boolean | null | undefined;
    _id: ObjectId
}

export const getBlogsQuery = (view: QueryBlogInputInterface): BlogSortInterface => ({
    searchNameTerm: view.searchNameTerm ?? null,
    sortBy: view.sortBy ?? 'createdAt',
    sortDirection: view.sortDirection ?? 'desc',
    pageNumber: view.pageNumber ?? 1,
    pageSize: view.pageSize ?? 10,
});

export const blogMapper = (blog: FlattenMaps<FlattenedBlogsInterface>) => ({
    id: String(blog._id),
    name: blog.name || '',
    description: blog.description || '',
    websiteUrl: blog.websiteUrl || '',
    createdAt: blog.createdAt?.toISOString() || '',
    isMembership: blog.isMembership || false,
})

/*--------------------------------------------------------------------------------------------------------------------*/

export interface QueryPosts {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
}

export const queryHelperToPost = (queryPost: QueryPosts) => ({
    pageNumber: queryPost.pageNumber ?? 1,
    pageSize: queryPost.pageSize ?? 10,
    sortBy: queryPost.sortBy ?? 'createdAt',
    sortDirection: queryPost.sortDirection ?? 'desc',
});

/*--------------------------------------------------------------------------------------------------------------------*/

export interface QueryUsers {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
}

export const queryHelperToUser = (queryUser: QueryUsers) => ({
    sortBy: queryUser.sortBy ?? 'createdAt',
    sortDirection: queryUser.sortDirection ?? 'desc',
    pageNumber: queryUser.pageNumber ?? 1,
    pageSize: queryUser.pageSize ?? 10,
    searchLoginTerm: queryUser.searchLoginTerm ?? null,
    searchEmailTerm: queryUser.searchEmailTerm ?? null,
});