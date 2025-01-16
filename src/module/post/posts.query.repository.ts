import {PostModelClass, StatusModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {PostSortInterface} from "../../common/utils/features/query.helper";
import {postsQueryRepositoryInterface} from "./models/post.models";
import {statuses} from "../like/models/like.models";
import {
    outputStatusUsersInterface,
    statusesUsersMapper,
    StatusResult,
    transformStatus
} from "../like/features/status.mapper";
import {transformPostStatusUsers} from "./features/post.mapper";

export class PostsQueryRepository implements postsQueryRepositoryInterface {
    async getAllPost(queryParamsToPost: PostSortInterface, userId?: string | null, blogId?: string): Promise<any/*allPostsInterface*/> {
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

            const likeStatuses = userId ? await this.getLikeStatus(userId, post._id.toString()).then(status => status ? transformStatus(status) : null) : null;

            const latestLikes: outputStatusUsersInterface[] = userId ? await this.getLatestThreeLikes(post._id.toString(), userId).then(users => users.map(user => statusesUsersMapper(user))) : [];

            return transformPostStatusUsers(post, likeStatuses, latestLikes);
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
    async giveOnePost(postId: string, userId?: string): Promise<void | any> {

        const resultPost = await PostModelClass.findById({_id: new ObjectId(postId)});

        if (!resultPost){
            return;
        }

        const resultLike = userId ? await this.getLikeStatus(userId, postId).then(status => status ? transformStatus(status) : null) : null;

        const users: outputStatusUsersInterface[] = userId ? await this.getLatestThreeLikes(postId, userId).then(users => users.map(user => statusesUsersMapper(user))) : [];

        return transformPostStatusUsers(resultPost, resultLike, users);
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