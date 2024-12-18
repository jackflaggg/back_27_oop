import "reflect-metadata";
import {BlogModelClass, PostModelClass, StatusModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {Blog} from "./dto/blog.entity";
import {
    blogMapper,
    blogMapperInterface,
    postMapperInterface
} from "../../common/utils/features/query.helper";
import {BlogCreateDto} from "./dto/blog.create.dto";
import {injectable} from "inversify";
import {BlogsDbRepositoryInterface, postViewModel} from "./models/blog.models";
import {transformPost} from "../../common/utils/mappers/post.mapper";
import {Post} from "../post/dto/post.entity";
import {ThrowError} from "../../common/utils/errors/custom.errors";
import {HTTP_STATUSES, nameErr} from "../../common/types/common";

@injectable()
export class BlogsDbRepository implements BlogsDbRepositoryInterface {
    async createBlog(entity: Blog): Promise<blogMapperInterface>{
        const newEntity =  await BlogModelClass.create(entity);
        return blogMapper(newEntity);
    }

    async createPostToBlog(entity: postViewModel | Post): Promise<any/*postMapperInterface*/> {
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

    async findPost(postId: string, userId?: ObjectId): Promise<postMapperInterface | any> {
        const post = await PostModelClass.findById({_id: new ObjectId(postId)});
        if (!post){
            throw new ThrowError(nameErr.NOT_FOUND);
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