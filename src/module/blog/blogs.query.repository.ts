import "reflect-metadata";
import {BlogModelClass, PostModelClass, StatusModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {
    blogMapper,
    BlogSortInterface, PostSortInterface,
} from "../../common/utils/features/query.helper";
import {injectable} from "inversify";
import {transformBlog} from "../../common/utils/mappers/blog.mapper";
import {
    BlogOutInterface,
    BlogsQueryRepositoriesInterface,
    getAllBlogInterface,
} from "./models/blog.models";
import {
    outputStatusUsersInterface,
    statusesUsersMapper,
    StatusResult,
    transformStatus
} from "../like/features/status.mapper";
import {transformPostStatusUsers} from "../post/features/post.mapper";
import {statuses} from "../like/models/like.models";
import {ThrowError} from "../../common/utils/errors/custom.errors";
import {nameErr} from "../../common/types/common";

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
    async giveOneBlog(blogId: string): Promise<BlogOutInterface> {
        const blog = await BlogModelClass.findById({_id: new ObjectId(blogId)});
        if (!blog){
            throw new ThrowError(nameErr.NOT_FOUND, [{message: 'блог не найден', field: '[BlogsQueryRepo]'}]);
        }
        return transformBlog(blog);
    }
    async getAllPostToBlog(queryParamsToPost: PostSortInterface, userId?: string | null, blogId?: string){
        const {pageNumber, pageSize, sortDirection, sortBy} = queryParamsToPost;

        const filter = blogId ? {blogId} : {}
        const posts = await PostModelClass
            .find(filter)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

        const totalCountBlogs = await PostModelClass.countDocuments(filter);

        const pageCount = Math.ceil(totalCountBlogs / pageSize);

        const mappedBlogsPromises = posts.map(async (post) => {

            const resultLike = userId ? await this.getLikeStatus(userId, post._id.toString()).then(status => status ? transformStatus(status) : null) : null;

            const users: outputStatusUsersInterface[] = userId ? await this.getLatestThreeLikes(post._id.toString(), userId).then(users => users.map(user => statusesUsersMapper(user))) : [];

            return transformPostStatusUsers(post, resultLike, users);
        })

        const mappedBlogs = await Promise.all(mappedBlogsPromises);

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountBlogs,
            items: mappedBlogs
        }
    }
    async getLikeStatus(userId: string, postId: string): Promise<StatusResult | null> {
        return StatusModelClass.findOne({ userId, parentId: postId });
    }
    async getLatestThreeLikes(postId: string, userId: string): Promise<StatusResult[]> {
        return StatusModelClass
            .find({parentId: new ObjectId(postId), status: statuses.LIKE})
            .sort({createdAt: -1})
            .limit(3);
    }
}