import {SortDirection} from "mongodb";

export interface QueryBlogInputInterface {
    searchNameTerm?: string | null,
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: number,
    pageSize?: number,
}

export interface BlogGaSortInterface {
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number,
    pageSize: number,
}

export interface QueryPosts {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string,
}

export interface QueryUsers {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
}

export const getBlogsQuery = (view: QueryBlogInputInterface): BlogGaSortInterface => ({
    searchNameTerm: view.searchNameTerm ?? null,
    sortBy: view.sortBy ?? 'createdAt',
    sortDirection: view.sortDirection ?? 'desc',
    pageNumber: view.pageNumber ?? 1,
    pageSize: view.pageSize ?? 10,
})

export const queryHelperToPost = (queryPost: QueryPosts) => ({
    pageNumber: queryPost.pageNumber ?? 1,
    pageSize: queryPost.pageSize ?? 10,
    sortBy: queryPost.sortBy ?? 'createdAt',
    sortDirection: queryPost.sortDirection ?? 'desc',
});

export const queryHelperToUser = (queryUser: QueryUsers) => ({
    sortBy: queryUser.sortBy ?? 'createdAt',
    sortDirection: queryUser.sortDirection ?? 'desc',
    pageNumber: queryUser.pageNumber ?? 1,
    pageSize: queryUser.pageSize ?? 10,
    searchLoginTerm: queryUser.searchLoginTerm ?? null,
    searchEmailTerm: queryUser.searchEmailTerm ?? null,
});