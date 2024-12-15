import {PostModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {transformPost, transformPostInterface} from "../../common/utils/mappers/post.mapper";
import {postMapper, PostSortInterface} from "../../common/utils/features/query.helper";

export class PostsQueryRepository {
    async getAllPost(queryParamsToPost: PostSortInterface) {
        const {pageNumber, pageSize, sortDirection, sortBy} = queryParamsToPost;

        const posts = await PostModelClass
            .find()
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

        const totalCountBlogs = await PostModelClass.countDocuments();

        const pageCount = Math.ceil(totalCountBlogs / pageSize);

        return {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountBlogs,
            items: posts.map(post => postMapper(post))
        }
    }
    async giveOnePost(id: string): Promise<transformPostInterface | void> {
        const result = await PostModelClass.findById({_id: new ObjectId(id)});
        if (!result){
            return;
        }
        return transformPost(result);
    }
}