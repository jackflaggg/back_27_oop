import {transformBlog} from "../../utils/mappers/blog.mapper";
import {OutGetAllBlogsModel} from "../../models/blog/output/output.type.blogs";
import {queryHelperToBlog, queryHelperToPost} from "../../utils/helpers/helper.query.get";
import {InQueryBlogModel} from "../../models/blog/input/input.type.blogs";
import {QueryHelperPost} from "../../models/post/helper-query-post/helper.post";
import {BlogModelClass, PostModelClass} from "../../db/db";
import {transformPost} from "../../utils/mappers/post.mapper";

export const blogsQueryRepositories = {
    async getAllBlog(queryParamsToBlog: InQueryBlogModel): Promise<OutGetAllBlogsModel> {
        const {searchNameTerm, sortBy, sortDirection, pageSize, pageNumber} = queryHelperToBlog(queryParamsToBlog);
        const blogs = await BlogModelClass
            .find(searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((Number(pageNumber) - 1) * Number(pageSize))
            .limit(Number(pageSize))
            .lean();

        const totalCountBlogs = await BlogModelClass.countDocuments(searchNameTerm ? { name: { $regex: searchNameTerm, $options: "i" }} : {});

        const pagesCount = Math.ceil(totalCountBlogs / Number(pageSize));

        return {
            pagesCount: +pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCountBlogs,
            items: blogs.map(blog => transformBlog(blog)),
        };
    },
    async giveOneToIdBlog(blogId: string)/*: Promise<OutBlogModel | null>*/ {
        const blog = await BlogModelClass.findById({_id: /*new ObjectId*/(blogId)});

        if (!blog) {
            return null;
        }

        return transformBlog(blog)
    },
    async getPostsToBlogID(paramsToBlogID: string, queryParamsPosts: QueryHelperPost)/*: Promise<OutGetAllPosts>*/ {
        const {pageNumber, pageSize, sortBy, sortDirection} = queryHelperToPost(queryParamsPosts);

        const posts = await PostModelClass
            .find({blogId: paramsToBlogID})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((Number(pageNumber) - 1) * Number(pageSize))
            .limit(Number(pageSize))

        const totalCountPosts = await PostModelClass.countDocuments({blogId: paramsToBlogID});

        const pagesCount = Math.ceil(totalCountPosts / Number(pageSize));

        return {
            pagesCount: +pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCountPosts,
            items: posts.map(post => transformPost(post))
        }
    }
}
