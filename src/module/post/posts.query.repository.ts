import {PostModelClass, StatusModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {transformPost, transformPostInterface} from "../../common/utils/mappers/post.mapper";
import {postMapper, postMapperInterface, PostSortInterface} from "../../common/utils/features/query.helper";
import {allPostsInterface, postsQueryRepositoryInterface} from "./models/post.models";
import {statusCode} from "../../common/types/common";
import {statuses} from "../like/models/like.models";
import mongoose from "mongoose";

export class PostsQueryRepository implements postsQueryRepositoryInterface {
    async getAllPost(queryParamsToPost: PostSortInterface, blogId?: string, userId?: string | null): Promise<allPostsInterface> {
        const {pageNumber, pageSize, sortDirection, sortBy} = queryParamsToPost;

        let filter: { blogId?: mongoose.Types.ObjectId} = {};

        if (blogId) {
            filter['blogId'] = new mongoose.Types.ObjectId(blogId);
        }
        const posts = await PostModelClass
            .find(filter)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

        const totalCountBlogs = await PostModelClass.countDocuments(filter);

        const pageCount = Math.ceil(totalCountBlogs / pageSize);

        const mappedBlogsPromises = posts.map(async (post) => {
            const likeStatus = userId ? await StatusModelClass.findOne({ userId: new ObjectId(userId), parentId: post._id}) : null

            const lastThreeLikes = await this.getLatestThreeLikes(post._id.toString())
        })
        const mappedBlogs = await Promise.all(mappedBlogsPromises)
        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountBlogs,
            items: mappedBlogs
        }
    }
    async giveOnePost(id: string, userId?: string): Promise<transformPostInterface | void> {
        const resultPost = await PostModelClass.findById({_id: new ObjectId(id)});
        if (!resultPost){
            return;
        }
        const resultLike = userId ? await this.getLikeStatus(userId, id) : null;
        const users = await this.getLatestThreeLikes(id);
        return transformPost(resultPost);
    }
    async getLikeStatus(userId: string, postId: string): Promise<any> {
        return StatusModelClass.findOne({ userId, parentId: postId })
    }
    async getLatestThreeLikes(postId: string): Promise<any> {
        return StatusModelClass
            .find({parentId: new ObjectId(postId), status: statuses.LIKE})
            .sort({createdAt: -1})
            .limit(3);
    }
}