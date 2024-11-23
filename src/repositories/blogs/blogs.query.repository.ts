import {BlogGaSortInterface, blogMapper} from "../../utils/features/query/get.blogs.query";
import {BlogModelClass} from "../../db/db";

export class BlogsQueryRepositories  {
    async getAllBlog(queryParamsToBlog: BlogGaSortInterface) {
        const {searchNameTerm, sortBy, sortDirection, pageSize, pageNumber} = queryParamsToBlog;

        const blogs = await BlogModelClass
            .find(searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {})
            .sort({[sortBy]: sortDirection})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

        const totalCountBlogs = await BlogModelClass.countDocuments(searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {});

        const pageCount = Math.ceil(totalCountBlogs / pageSize);

        return {
            pagesCount: Number(pageCount),
            page: Number(pageNumber),
            pageSize: Number(pageSize),
            totalCount: Number(totalCountBlogs),
            items: blogs.map(blog => blogMapper(blog))
        }
    }
    async giveOneToIdBlog(blogId: string) {

    }
    async getPostsToBlogID(paramsToBlogID: string, queryParamsPosts: any) {

    }
}