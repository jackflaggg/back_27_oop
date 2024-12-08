import {BlogModelClass, PostModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {
    blogMapper,
    BlogSortInterface,
    BlogToPostSortInterface,
    postMapper
} from "../../common/utils/features/query.helper";
import {injectable} from "inversify";

@injectable()
export class BlogsQueryRepositories  {
    async getAllBlog(queryParamsToBlog: BlogSortInterface) {
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
    async giveOneBlog(blogId: string) {
        const blog = await BlogModelClass.findById({_id: new ObjectId(blogId)});
        return blog
    }
    async getPostsToBlogID(paramsToBlogID: ObjectId, queryParamsPosts: BlogToPostSortInterface) {
        const {pageNumber, pageSize, sortBy, sortDirection} = queryParamsPosts;
        const posts = await PostModelClass
            .find({blogId: String(paramsToBlogID)})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1)* pageSize)
            .limit(pageSize)
            .lean()

        const totalCountPosts = await PostModelClass.countDocuments({blogId: String(paramsToBlogID)});

        const pageCount = Math.ceil(totalCountPosts / pageSize);

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountPosts,
            items: posts.map( p => postMapper(p))
        }
    }
}