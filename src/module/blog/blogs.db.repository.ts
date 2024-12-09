import {BlogModelClass, PostModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {Blog} from "./dto/blog.entity";
import {postMapper} from "../../common/utils/features/query.helper";
import {BlogCreateDto} from "./dto/blog.create.dto";
import {injectable} from "inversify";

@injectable()
export class BlogsDbRepository {
    async createBlog(entity: Blog){
        return await BlogModelClass.create(entity);
    }

    async createPostToBlog(entity: any) {
        return await PostModelClass.create(entity);
    }

    async findBlogById(blogId: string) {
        const blog = await BlogModelClass.findById({_id: new ObjectId(blogId)});
        if (!blog){
            return;
        }
        return blog;
    }

    async findPost(postId: string) {
        const post = await PostModelClass.findById({_id: new ObjectId(postId)});
        if (!post){
            return;
        }
        return postMapper(post);
    }

    async updateBlog(blogDto: BlogCreateDto){
        const {name, description, websiteUrl} = blogDto;
        const blog = await BlogModelClass.updateOne({
            name, description, websiteUrl
        })
        return blog.modifiedCount === 1;
    }

    async deleteBlog(blogId: string){
        const blog = await BlogModelClass.deleteOne({
            _id: new ObjectId(blogId)
        })
        return blog.deletedCount === 1;
    }
}