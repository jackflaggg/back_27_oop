import {BlogGaSortInterface} from "../../utils/features/query/get.blogs.query";

export class BlogsQueryRepositories  {
    async getAllBlog(queryParamsToBlog: BlogGaSortInterface) {
        const {searchNameTerm, sortBy, sortDirection, pageSize, pageNumber} = queryParamsToBlog;
    }
    async giveOneToIdBlog(blogId: string) {

    }
    async getPostsToBlogID(paramsToBlogID: string, queryParamsPosts: any) {

    }
}