import {BlogModelClass, PostModelClass, StatusModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {Blog} from "./dto/blog.entity";
import {
    blogMapper,
    blogMapperInterface,
    postMapper,
    postMapperInterface
} from "../../common/utils/features/query.helper";
import {BlogCreateDto} from "./dto/blog.create.dto";
import {injectable} from "inversify";
import {BlogsDbRepositoryInterface, postViewModel} from "./models/blog.models";
import {transformPost} from "../../common/utils/mappers/post.mapper";

@injectable()
export class BlogsDbRepository implements BlogsDbRepositoryInterface {
    async createBlog(entity: Blog): Promise<blogMapperInterface>{
        const newEntity =  await BlogModelClass.create(entity);
        return blogMapper(newEntity);
    }

    async createPostToBlog(entity: postViewModel): Promise<any/*postMapperInterface*/> {
        const newEntity = await PostModelClass.create(entity);
        return newEntity._id.toString()
    }

    async findBlogById(blogId: string): Promise<blogMapperInterface | void> {
        const blog = await BlogModelClass.findById({_id: new ObjectId(blogId)});
        if (!blog){
            return;
        }
        return blogMapper(blog);
    }

    async findPost(postId: string, userId?: ObjectId): Promise<postMapperInterface | void | any> {
        const post = await PostModelClass.findById({_id: new ObjectId(postId)});
        if (!post){
            return;
        }
        //const status = userId ? await StatusModelClass.findOne({userId, parentId: postId}) : null;
        return transformPost(post);
    }

    async updateBlog(blogDto: BlogCreateDto): Promise<boolean> {
        const {name, description, websiteUrl} = blogDto;
        const blog = await BlogModelClass.updateOne({
            name, description, websiteUrl
        })
        return blog.modifiedCount === 1;
    }

    async deleteBlog(blogId: string): Promise<boolean>{
        const blog = await BlogModelClass.deleteOne({
            _id: new ObjectId(blogId)
        })
        return blog.deletedCount === 1;
    }
}