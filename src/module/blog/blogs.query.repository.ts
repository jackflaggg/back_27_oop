import {BlogModelClass, PostModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {
    blogMapper,
    BlogSortInterface,
    BlogToPostSortInterface,
    postMapper
} from "../../common/utils/features/query.helper";
import {injectable} from "inversify";
import {transformBlog} from "../../common/utils/mappers/blog.mapper";
import {
    BlogOutInterface,
    BlogsQueryRepositoriesInterface,
    getAllBlogInterface,
} from "./models/blog.models";

@injectable()
export class BlogsQueryRepositories implements BlogsQueryRepositoriesInterface {
    async getAllBlog(queryParamsToBlog: BlogSortInterface): Promise<getAllBlogInterface> {
        const {searchNameTerm, sortBy, sortDirection, pageSize, pageNumber} = queryParamsToBlog;

        const blogs = await BlogModelClass
            .find(searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
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
            items: blogs ? blogs.map(blog => blogMapper(blog)) : []
        }
    }
    async giveOneBlog(blogId: string): Promise<BlogOutInterface | void> {
        const blog = await BlogModelClass.findById({_id: new ObjectId(blogId)});
        if (!blog){
            return;
        }
        return transformBlog(blog);
    }
}