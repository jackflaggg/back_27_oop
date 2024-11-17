import {blogMapper} from "../../utils/mappers/blog.mapper";
import {postMapper} from "../../utils/mappers/post.mapper";
import {OutGetAllBlogsModel, OutBlogModel} from "../../models/blog/output/output.type.blogs";
import {ObjectId} from "mongodb";
import {queryHelperToBlog, queryHelperToPost} from "../../utils/helpers/helper.query.get";
import {InQueryBlogModel} from "../../models/blog/input/input.type.blogs";
import {OutGetAllPosts} from "../../models/post/output/output.type.posts";
import {QueryHelperPost} from "../../models/post/helper-query-post/helper.post";
import {blogModel, postModel} from "../../db/db";

export const blogsQueryRepositories = {
    async getAllBlog(queryParamsToBlog: InQueryBlogModel): Promise<OutGetAllBlogsModel> {
        const {searchNameTerm, sortBy, sortDirection, pageSize, pageNumber} = queryHelperToBlog(queryParamsToBlog);
        const blogs = await blogModel
            .find(searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {})
            .sort(sortBy, sortDirection)
            .skip((Number(pageNumber) - 1) * Number(pageSize))
            .limit(Number(pageSize));

        const totalCountBlogs = await blogModel.countDocuments(searchNameTerm ? { name: { $regex: searchNameTerm, $options: "i" }} : {});

        const pagesCount = Math.ceil(totalCountBlogs / Number(pageSize));

        return {
            pagesCount: +pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCountBlogs,
            items: blogs.map(blog => blogMapper(blog)),
        };
    },
    async giveOneToIdBlog(blogId: string): Promise<OutBlogModel | null> {
        const blog = await blogModel.findOne({_id: new ObjectId(blogId)});

        if (blog === null) {
            return null;
        }
        return blogMapper(blog)
    },
    async getPostsToBlogID(paramsToBlogID: string, queryParamsPosts: QueryHelperPost): Promise<OutGetAllPosts> {
        const {pageNumber, pageSize, sortBy, sortDirection} = queryHelperToPost(queryParamsPosts);

        const posts = await postModel
            .find({blogId: paramsToBlogID})
            .sort(sortBy, sortDirection)
            .skip((Number(pageNumber) - 1) * Number(pageSize))
            .limit(Number(pageSize))

        const totalCountPosts = await postModel.countDocuments({blogId: paramsToBlogID});

        const pagesCount = Math.ceil(totalCountPosts / Number(pageSize));

        return {
            pagesCount: +pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCountPosts,
            items: posts.map(post => postMapper(post))
        }
    }
}
