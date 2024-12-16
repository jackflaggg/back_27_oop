import {PostModelClass, StatusModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {transformPost, transformPostInterface} from "../../common/utils/mappers/post.mapper";
import {postMapper, postMapperInterface, PostSortInterface} from "../../common/utils/features/query.helper";
import {allPostsInterface, postsQueryRepositoryInterface} from "./models/post.models";
import {statusCode} from "../../common/types/common";
import {statuses} from "../like/models/like.models";
import mongoose from "mongoose";
import {
    outputStatusUsersInterface,
    statusesUsersMapper,
    StatusResult,
    transformStatus
} from "../like/features/status.mapper";
import {transformUserToOut} from "../../common/utils/mappers/user.mapper";
import {transformPostStatusUsers} from "./features/post.mapper";

export class PostsQueryRepository implements postsQueryRepositoryInterface {
    async getAllPost(queryParamsToPost: PostSortInterface, userId?: string | null): Promise<allPostsInterface> {
        const {pageNumber, pageSize, sortDirection, sortBy} = queryParamsToPost;

        const posts = await PostModelClass
            .find()
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

        const totalCountBlogs = await PostModelClass.countDocuments();

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
    async giveOnePost(postId: string, userId?: string): Promise<transformPostInterface | void> {
        const resultPost = await PostModelClass.findById({_id: new ObjectId(postId)});

        console.log(resultPost)
        if (!resultPost){
            return;
        }
        const resultLike = userId ? await this.getLikeStatus(userId, postId).then(status => status ? transformStatus(status) : null) : null;

        const users: outputStatusUsersInterface[] = await this.getLatestThreeLikes(postId).then(users => users.map(user => statusesUsersMapper(user)));

        console.log(users)
        return transformPostStatusUsers(resultPost, resultLike, users);
    }
    async getLikeStatus(userId: string, postId: string): Promise<StatusResult | void | null> {
        const status = StatusModelClass.findOne({ userId, parentId: postId });

        return status
    }
    async getLatestThreeLikes(postId: string): Promise<StatusResult[]> {
        const users = StatusModelClass
            .find({parentId: new ObjectId(postId), status: statuses.LIKE})
            .sort({createdAt: -1})
            .limit(3);

        return users
    }
}