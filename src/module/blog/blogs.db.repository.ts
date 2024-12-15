import {BlogModelClass, PostModelClass} from "../../common/database";
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
import {BlogsDbRepositoryInterface} from "../../models/blog/blog.models";

@injectable()
export class BlogsDbRepository implements BlogsDbRepositoryInterface {
    async createBlog(entity: Blog): Promise<blogMapperInterface>{
        const newEntity =  await BlogModelClass.create(entity);
        return blogMapper(newEntity);
    }

    async createPostToBlog(entity: any): Promise<postMapperInterface> {
        const newEntity = await PostModelClass.create(entity);
        return postMapper(newEntity);
    }

    async findBlogById(blogId: string): Promise<blogMapperInterface | void> {
        const blog = await BlogModelClass.findById({_id: new ObjectId(blogId)});
        if (!blog){
            return;
        }
        return blogMapper(blog);
    }

    async findPost(postId: string): Promise<postMapperInterface | void> {
        const post = await PostModelClass.findById({_id: new ObjectId(postId)});
        if (!post){
            return;
        }
        return postMapper(post);
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