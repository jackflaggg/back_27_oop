import {postMapper, PostSortInterface} from "../../utils/features/query/query.helper";
import {PostModelClass} from "../../db/db";
import {ObjectId} from "mongodb";

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
            items: posts ? posts.map(post => postMapper(post)): []
        }
    }
    async giveOneToIdPost(id: string) {
        const result = await PostModelClass.findById({_id: new ObjectId(id)});
        if (!result){
            return;
        }
        return result;
    }
}